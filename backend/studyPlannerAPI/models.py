from django.db import models


class ModelRequest(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    model = models.TextField()
    temperature = models.FloatField()
    prompt = models.TextField()
    response = models.TextField(null=True)

    class Meta:
        ordering = ["timestamp"]
