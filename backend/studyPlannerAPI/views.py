from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import JSONParser
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from studyPlannerAPI.models import ModelRequest, CustomUser
from studyPlannerAPI.serializers import ModelRequestSerializer, RegisterSerializer, TokenSerializer

from studyPlanner.services import StudyPlanner

from django.conf import settings
import json
from datetime import datetime, date, timedelta

from .models import Subject, Material, StudySession
from .serializers import SubjectSerializer, MaterialSerializer, StudySessionSerializer

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
    """
    Pobiera plan zajęć z API ZUT i zapisuje jako przedmioty w bazie.
    """
    try:
        user = request.user
        force_refresh = request.query_params.get('refresh', 'false').lower() == 'true'

        has_subjects = Subject.objects.filter(user=user).exists()

        last_update = user.profile.last_schedule_update if hasattr(user, 'profile') else None
        needs_update = (
            force_refresh or
            not has_subjects or
            not last_update or
            datetime.now() - last_update > timedelta(days=1)
        )

        if needs_update:
            try:
                planner = StudyPlanner()
                schedule_data = planner.get_schedule(user.album_number)

                if hasattr(user, 'profile'):
                    user.profile.last_schedule_update = datetime.now()
                    user.profile.save()

                existing_subjects = Subject.objects.filter(user=user, is_mastered=False)

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

                    if not created:
                        existing_subjects = existing_subjects.exclude(id=subject.id)

                existing_subjects.delete()

                if hasattr(user, 'profile'):
                    user.profile.last_schedule_update = datetime.now()
                    user.profile.save()
            except Exception as e:
                print(f"Błąd podczas pobierania planu zajęć: {e}")

        subjects = Subject.objects.filter(user=user).order_by('start_datetime')
        serializer = SubjectSerializer(subjects, many=True)

        return Response({
            'data': serializer.data,
            'last_update': last_update.isoformat() if last_update else None,
            'refreshed': needs_update,
            'empty_response': len(subjects) == 0
        })
    except Exception as e:
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
        serializer = MaterialSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(subject=subject)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


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
