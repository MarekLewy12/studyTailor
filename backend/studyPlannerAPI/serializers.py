from rest_framework import serializers
from studyPlannerAPI.models import ModelRequest


class ModelRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelRequest
        fields = ["id", "timestamp", "model", "temperature", "prompt", "response"]
