import math
import os.path

from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import JSONParser
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from studyPlannerAPI.models import ModelRequest, CustomUser
from studyPlannerAPI.serializers import ModelRequestSerializer, RegisterSerializer, TokenSerializer
from studyPlannerAPI.conversation_context import ConversationContext

from studyPlanner.services import StudyPlanner, DeepseekAIService

from django.conf import settings
from django.http import HttpResponse
import json
from datetime import datetime, date, timedelta

from .models import Subject, Material, StudySession
from .serializers import SubjectSerializer, MaterialSerializer, StudySessionSerializer, MaterialSubjectSerializer

@api_view(['GET'])
def root_view(request):
    """
    Widok głównej strony API.
    """
    return Response({
        'message': 'Witaj w API StudyTailor',
        'endpoints': {
            'generowanie_planu': '/',
            'rejestracja': '/register/',
            'logowanie': '/login/',
            'dokumentacja': '/docs/'
        }
    })


@api_view(["GET", "POST"])
def model_requests_list(request):
    """
    Lista wszystkich żądań modelu lub utworzenie nowego żądania modelu

    GET: Zwraca listę wszystkich żądań modelu
    POST: Tworzy nowe żądanie modelu
    """
    if request.method == "GET":
        model_requests = ModelRequest.objects.all()
        serializer = ModelRequestSerializer(model_requests, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        data = JSONParser().parse(request)

        planner = StudyPlanner()
        schedule = planner.get_schedule(data["album_number"])

        preferences = data.get("preferences", {})
        study_plan = planner.generate_study_plan(schedule, preferences)

        data["model"] = planner.model
        data["temperature"] = planner.temperature
        data["prompt"] = planner.last_prompt
        data["response"] = study_plan

        serializer = ModelRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def model_request_details(request, pk):
    try:
        model_request = ModelRequest.objects.get(pk=pk)
    except ModelRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ModelRequestSerializer(model_request)
        return Response(serializer.data)


# Rejestracja użytkownika
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    @swagger_auto_schema(
        request_body=RegisterSerializer,
        responses={201: TokenSerializer()},
    )

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        username = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')
        album_number = serializer.validated_data.get('album_number')

        # jeśli login istnieje
        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Użytkownik o takim loginie już istnieje! Stwórz inny"}, status=status.HTTP_400_BAD_REQUEST)

        # jeśli numer albumu istnieje
        if CustomUser.objects.filter(album_number=album_number).exists():
            return Response({"error": "Użytkownik o takim numerze albumu już istnieje! Stwórz inny"}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create_user(username=username, password=password, album_number=album_number)
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


# Logowanie użytkownika
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = CustomUser.objects.filter(username=username).first()

    if user is None or not user.check_password(password):
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_subjects(request):
    try:
        user = request.user
        force_refresh = request.query_params.get('refresh', 'false').lower() == 'true'

        has_subjects = Subject.objects.filter(user=user).exists()

        last_update = None

        try:
            if hasattr(user, 'profile') and user.profile.last_schedule_update:
                last_update = user.profile.last_schedule_update
                if not isinstance(last_update, datetime):
                    try:
                        # Próba konwersji z ISO formatu jeśli to string
                        if isinstance(last_update, str):
                            last_update = datetime.fromisoformat(last_update)
                        else:
                            last_update = None
                    except ValueError:
                        last_update = None
        except Exception as e:
            last_update = None
            print(f"Błąd podczas próby pobrania last_update: {e}")

        try:
            needs_update = (
                    force_refresh or
                    not has_subjects or
                    not last_update or
                    (datetime.now() - last_update > timedelta(days=1))
            )
        except Exception as e:
            needs_update = True
            print(f"Błąd podczas porównywania dat: {e}")

        if needs_update:
            try:
                planner = StudyPlanner()
                schedule_data = planner.get_schedule(user.album_number)

                if schedule_data:
                    preserved_ids = []

                    for item in schedule_data:
                        subject, created = Subject.objects.update_or_create(
                            user=user,
                            name=item['subject'],
                            lesson_form=item['lesson_form'],
                            start_datetime=item['start_datetime'],
                            defaults={
                                'end_datetime': item['end_datetime']
                            }
                        )
                        preserved_ids.append(subject.id)

                    if preserved_ids:
                        Subject.objects.filter(
                            user=user,
                            is_mastered=False
                        ).exclude(
                            id__in=preserved_ids
                        ).delete()

                # Bezpieczna aktualizacja last_update
                if hasattr(user, 'profile'):
                    user.profile.last_schedule_update = datetime.now()
                    user.profile.save()
                    last_update = user.profile.last_schedule_update
            except Exception as e:
                print(f"Błąd podczas pobierania planu zajęć: {e}")

        subjects = Subject.objects.filter(user=user).order_by('start_datetime')
        serializer = SubjectSerializer(subjects, many=True)

        # Bezpieczna serializacja last_update
        last_update_iso = None
        if last_update:
            try:
                if hasattr(last_update, 'isoformat'):
                    last_update_iso = last_update.isoformat()
                elif isinstance(last_update, str):
                    last_update_iso = last_update
                else:
                    last_update_iso = str(last_update)
            except Exception:
                last_update_iso = datetime.now().isoformat()
        else:
            last_update_iso = datetime.now().isoformat()

        return Response({
            'data': serializer.data,
            'last_update': last_update_iso,
            'refreshed': needs_update,
            'empty_response': len(subjects) == 0
        })
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Krytyczny błąd w get_subjects: {e}\n{error_details}")
        return Response({"error": str(e)}, status=500)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def toggle_subject_mastered(request, pk):
    """
    Oznaczanie przedmiotu jako przyswojony/nieprzyswojony
    """
    try:
        subject = Subject.objects.get(pk=pk, user=request.user)
    except Subject.DoesNotExist:
        return Response(status=404)

    subject.is_mastered = not subject.is_mastered
    subject.save()

    serializer = SubjectSerializer(subject)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def study_with_ai(request, subject_id):
    """
    Sesja nauki z AI dla konkretnego przedmiotu
    """
    try:
        subject = Subject.objects.get(pk=subject_id, user=request.user)
    except Subject.DoesNotExist:
        return Response({"error": "Przedmiot nie istnieje"}, status=404)

    question = request.data.get('question')
    if not question:
        return Response({"error": "Brak pytania"}, status=400)

    planner = StudyPlanner()
    prompt = f"""
    Jestem studentem uczącym się przedmiotu "{subject.name}".
    Oto moje pytanie: {question}

    Odpowiedz w sposób jasny, zwięzły i pomocny. Podaj konkretne informacje
    i przykłady, które pomogą mi zrozumieć materiał.
    """

    try:
        response = planner.client.chat.completions.create(
            model=planner.model,
            messages=[
                {"role": "system", "content": "Jesteś pomocnym asystentem nauki."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1024,
            temperature=0.7,
        )

        answer = response.choices[0].message.content

        # Zapisz sesję nauki
        session = StudySession.objects.create(
            user=request.user,
            subject=subject,
            questions=question,
            answers=answer
        )

        return Response({
            "subject": subject.name,
            "question": question,
            "answer": answer
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def materials(request, subject_id):
    """
    Lista materiałów dla przedmiotu lub dodawanie nowego materiału
    """
    try:
        subject = Subject.objects.get(pk=subject_id, user=request.user)
    except Subject.DoesNotExist:
        return Response({"error": "Przedmiot nie istnieje"}, status=404)

    if request.method == 'GET':
        materials = Material.objects.filter(subject=subject)
        serializer = MaterialSerializer(materials, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        try:
            print("==== DEBUG: Dodawanie materiału ====")
            print("Content-Type:", request.content_type)
            print("FILES:", request.FILES)
            print("POST data:", request.POST)

            serializer = MaterialSerializer(data=request.data)
            if serializer.is_valid():
                print("Serializer valid, fields:", serializer.validated_data)
                material = serializer.save(subject=subject)
                print("Material saved successfully, ID:", material.id)
                return Response(serializer.data, status=201)
            else:
                print("Validation errors:", serializer.errors)
                return Response(serializer.errors, status=400)
        except Exception as e:
            import traceback
            print("Exception during file upload:", str(e))
            print(traceback.format_exc())
            return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def verify_album_number(request):
    album_number = request.data.get('album_number')

    try:
        study_planner = StudyPlanner()
        schedule = study_planner.get_schedule(album_number)

        # Sprawdzenie czy otrzymaliśmy jakiekolwiek dane
        if not schedule or len(schedule) == 0:
            return Response({"valid": False, "message": "Nie znaleziono planu zajęć dla tego numeru albumu"})

        return Response({"valid": True})

    except Exception as e:
        return Response({"valid": False, "message": str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def material_download(request, subject_id, material_id):
    """Pobieranie pliku materiału z S3"""
    try:
        subject = Subject.objects.get(pk=subject_id, user=request.user)
        material = Material.objects.get(pk=material_id, subject=subject)

        if not material.file:
            return Response({"error": "Brak pliku do pobrania"}, status=404)

        file_name = os.path.basename(material.file.name)
        file_content = material.file.read()

        response = HttpResponse(file_content)
        response['Content-Disposition'] = f'attachment; filename="{file_name}"'
        response['Content-Type'] = 'application/octet-stream'

        return response

    except Subject.DoesNotExist:
        return Response({"error": "Przedmiot nie istnieje"}, status=404)
    except Material.DoesNotExist:
        return Response({"error": "Materiał nie istnieje"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def material_delete(request, subject_id, material_id):
    """Usuwanie materiału oraz pliku z S3"""
    try:
        subject = Subject.objects.get(pk=subject_id, user=request.user)
        material = Material.objects.get(pk=material_id, subject=subject)
    except Subject.DoesNotExist:
        return Response({"error": "Przedmiot nie istnieje"}, status=404)
    except Material.DoesNotExist:
        return Response({"error": "Materiał nie istnieje"}, status=404)

    material.delete()
    return Response(status=204)

# ---------- DEEPSEEK ----------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def subject_assistant(request, subject_id):
    """
    Endpoint do interakcji z asystentem AI dla konkretnego przedmiotu
    """
    try:
        subject = Subject.objects.get(pk=subject_id, user=request.user)
    except Subject.DoesNotExist:
        return Response({"error": "Przedmiot nie istnieje"}, status=404)

    question = request.data.get('question')
    if not question:
        return Response({"error": "Brak pytania"}, status=400)

    try:
        api_key = os.getenv('DEEPSEEK_API_KEY')
        if not api_key:
            return Response({"error": "Brak klucza API DeepSeek"}, status=500)

        ai_service = DeepseekAIService(api_key)

        conversation_history = ConversationContext.get_conversation_history(
            user_id=request.user.id,
            subject_id=subject.id,
        )

        result = ai_service.generate_study_assistant_response(
            subject_name=subject.name,
            question=question,
            subject_type=subject.lesson_form,
            conversation_history=conversation_history
        )

        if isinstance(result, dict) and 'response' in result and 'elapsed_time' in result:
            answer = result['response']
            elapsed_time = result['elapsed_time']
        else:
            answer = result
            elapsed_time = None

        # zapisanie do bazy
        study_session = StudySession.objects.create(
            user=request.user,
            subject=subject,
            questions=question,
            answers=answer,
            elapsed_time=elapsed_time
        )

        # dodanie do historii konwersacji
        ConversationContext.add_to_conversation_history(
            user_id=request.user.id,
            subject_id=subject.id,
            question=question,
            answer=answer
        )

        return Response({
            "subject": subject.name,
            "question": question,
            "answer": answer,
            "timestamp": study_session.created_at.isoformat(),
            "elapsed_time": elapsed_time
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def chat_history(request, subject_id):
    """
    Pobieranie historii czatu dla konkretnego przedmiotu
    """
    try:
        subject = Subject.objects.get(pk=subject_id, user=request.user)
    except Subject.DoesNotExist:
        return Response({"error": "Przedmiot nie istnieje"}, status=404)

    if request.method == 'GET':
        sessions = StudySession.objects.filter(
            user=request.user,
            subject=subject
        ).order_by(
            'created_at'
        )

        messages = []

        if not sessions.exists():
            messages.append({
                "sender": "ai",
                "text": f"Witaj! Jak mogę Ci pomóc w nauce przedmiotu {subject.name}?",
                "timestamp": datetime.now().isoformat()
            })
        else:
            for session in sessions:
                messages.append({
                    "sender": "user",
                    "text": session.questions,
                    "timestamp": session.created_at.isoformat()
                })
                messages.append({
                    "sender": "ai",
                    "text": session.answers,
                    "timestamp": session.created_at.isoformat(),
                    "elapsed_time": session.elapsed_time
                })
        return Response(messages)
    elif request.method == 'DELETE':
        StudySession.objects.filter(
            user=request.user,
            subject=subject
        ).delete()
        return Response(status=204)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_materials(request):
    """Pobieranie wszystkich materiałów użytkownika"""
    try:
        materials = Material.objects.filter(subject__user=request.user).select_related('subject')
        serializer = MaterialSubjectSerializer(materials, many=True)

        # wyliczenie łącznej wielkości materiałów użytkownika
        total_size = sum([m.file.size for m in materials if m.file]) if materials else 0

        return Response({
        'data': serializer.data,
        'stats': {
            'total_count': materials.count(),
            'total_count_files': materials.filter(file__isnull=False).exclude(file='').count(),
            'total_count_links': materials.filter(link__isnull=False).exclude(link='').count(),
            'total_size_in_bytes': total_size,
            'total_size_readable': get_readable_file_size(total_size)
        }
        })

    except Exception as e:
        return Response({"Wystąpił błąd z pobieraniem materiałów": str(e)}, status=500)


def get_readable_file_size(bytes_size):
    if bytes_size == 0:
        return "0B"
    sizes = ["B", "KB", "MB", "GB", "TB"]

    i = int(math.floor(math.log(bytes_size, 1024)))  # obliczamy, który rozmiar z listy sizes jest odpowiedni
    p = math.pow(1024, i)  # ile bajtów ma 1 KB, 1 MB, itd.
    s = round(bytes_size / p, 2)  # obliczamy wielkość w odpowiednich jednostkach

    return f"{s} {sizes[i]}"


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_chat_context(request, subject_id):
    """Czyszczenie kontekstu konwersacji"""
    try:
        subject = Subject.objects.get(pk=subject_id, user=request.user)

        ConversationContext.clear_conversation_history(
            user_id=request.user.id,
            subject_id=subject.id
        )

        return Response({"message": "Kontekst konwersacji został wyczyszczony"}, status=status.HTTP_200_OK)

    except Subject.DoesNotExist:
        return Response({"error": "Przedmiot nie istnieje"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




