from rest_framework import serializers
from studyPlannerAPI.models import ModelRequest
from .models import Subject, Material, StudySession


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


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = ['id', 'title', 'description', 'file', 'link', 'created_at']

class MaterialSubjectSerializer(serializers.ModelSerializer):
    subject_id = serializers.CharField(source='subject.id', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    lesson_form = serializers.CharField(source='subject.lesson_form', read_only=True)

    class Meta:
        model = Material
        fields = ['id', 'title', 'description', 'file', 'link', 'created_at', 'subject_id', 'subject_name', 'lesson_form']


class SubjectSerializer(serializers.ModelSerializer):
    materials_count = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = ['id', 'name', 'lesson_form', 'start_datetime', 'end_datetime', 'is_mastered', 'materials_count']

    def get_materials_count(self, obj):
        return obj.materials.count()


class StudySessionSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = StudySession
        fields = ['id', 'subject', 'subject_name', 'questions', 'answers', 'created_at']