from django.contrib.auth.models import AbstractUser
from django.db import models


class ModelRequest(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    model = models.TextField()
    temperature = models.FloatField()
    prompt = models.TextField()
    response = models.TextField(null=True)

    class Meta:
        ordering = ["timestamp"]

# Model studencki z numerem albumu
class CustomUser(AbstractUser):
    album_number = models.CharField(max_length=5, unique=True)