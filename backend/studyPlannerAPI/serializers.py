from rest_framework import serializers
from studyPlannerAPI.models import ModelRequest


class ModelRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelRequest
        fields = ["id", "timestamp", "model", "temperature", "prompt", "response"]

# Serializator do rejestracji użytkownika (do Swaggera)
class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)
    album_number = serializers.CharField(max_length=5)

# Serializator, opisujący zwracane dane w Response przy rejestracji użytkownika
class TokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    access = serializers.CharField()
