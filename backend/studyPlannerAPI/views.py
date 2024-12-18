from django.contrib.auth.models import User
from rest_framework.parsers import JSONParser
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from studyPlannerAPI.models import ModelRequest
from studyPlannerAPI.serializers import ModelRequestSerializer

from studyPlanner.services import StudyPlanner


@api_view(["GET", "POST"])
def model_requests_list(request):
    if request.method == "GET":
        model_requests = ModelRequest.objects.all()
        serializer = ModelRequestSerializer(model_requests, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        data = JSONParser().parse(request)

        planner = StudyPlanner()
        schedule = planner.get_schedule(data["album_number"])
        # subjects = planner.display_subjects(schedule)
        # preferences = planner.get_user_preferences(subjects)
        preferences = None
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
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password)
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


# Logowanie użytkownika
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = User.objects.filter(username=username).first()
    if user is None or not user.check_password(password):
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    })