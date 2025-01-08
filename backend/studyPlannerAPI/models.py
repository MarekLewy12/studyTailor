from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models

class CustomUserManager(UserManager):
    def create_superuser(
        self, username, email = ..., password = ..., **extra_fields
    ):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        # Usuwanie numeru albumu
        extra_fields.pop("album_number", None)

        return self._create_user(username, email, password, **extra_fields)


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
    album_number = models.CharField(max_length=5, unique=True, null=True, blank=True)

    # Podmiana domyślnego managera na CustomUserManager
    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.album_number = None
        elif not self.album_number:
            raise ValueError("Album number is required for non-superusers.")
        super().save(*args, **kwargs)