from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import JSONParser
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from studyPlannerAPI.models import ModelRequest, CustomUser
from studyPlannerAPI.serializers import ModelRequestSerializer, RegisterSerializer, TokenSerializer

from studyPlanner.services import StudyPlanner

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
    album_number = request.data.get('album_number')

    user = CustomUser.objects.filter(username=username, album_number=album_number).first()
    if user is None or not user.check_password(password):
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    })