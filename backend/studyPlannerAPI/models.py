from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.conf import settings

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


class Subject(models.Model):
    """Model przedmiotu z planu zajęć"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subjects')
    name = models.CharField(max_length=200)
    lesson_form = models.CharField(max_length=100)  # np. wykład, laboratorium
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    is_mastered = models.BooleanField(default=False)  # Czy materiał został przyswojony
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_datetime']

    def __str__(self):
        return f"{self.name} ({self.start_datetime.strftime('%Y-%m-%d %H:%M')})"


class Material(models.Model):
    """Materiały do nauki dla przedmiotu"""
    PROCESSING_STATUS_CHOICES = [
        ('pending', 'Oczekujący'),
        ('processing', 'W trakcie przetwarzania'),
        ('completed', 'Przetworzony'),
        ('failed', 'Nieudany'),
    ]

    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='materials')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='materials/', blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # RAG
    processing_status = models.CharField(
        max_length=20,
        choices=PROCESSING_STATUS_CHOICES,
        default='pending',
        verbose_name="Status przetwarzania PDF"
    )
    error_message = models.TextField(
        blank=True,
        null=True,
        verbose_name="Komunikat o błędzie"
    )

    def __str__(self):
        return self.title


class StudySession(models.Model):
    """Historia sesji nauki z AI dla przedmiotu"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='study_sessions')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='study_sessions')
    questions = models.TextField()
    answers = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    elapsed_time = models.FloatField(null=True, blank=True)
    message_type = models.CharField(max_length=20, default='question_answer')
    ai_model = models.CharField(
        max_length=20,
        default='deepseek',
        choices=[('deepseek', 'Deepseek AI'), ('gpt-4o', 'GPT-4o')]
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'subject'])
        ]

    def __str__(self):
        return f"Sesja nauki: {self.subject.name} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    last_schedule_update = models.DateTimeField(null=True, blank=True)


    def __str__(self):
        return f"Profil użytkownika: {self.user.username}"
