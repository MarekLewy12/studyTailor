from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.conf import settings

class CustomUserManager(UserManager):
    """
    @class CustomUserManager
    @brief Menedżer użytkowników niestandardowych.
    
    Klasa rozszerzająca domyślnego UserManagera Django, umożliwiająca tworzenie użytkowników z dodatkowymi polami oraz logiką biznesową.
    """
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
    """
    @class ModelRequest
    @brief Model zapytania do modelu AI.
    
    Przechowuje informacje o zapytaniach do modeli AI, w tym prompt, odpowiedź, temperaturę i znacznik czasu.
    """
    timestamp = models.DateTimeField(auto_now_add=True)
    model = models.TextField()
    temperature = models.FloatField()
    prompt = models.TextField()
    response = models.TextField(null=True)

    class Meta:
        ordering = ["timestamp"]

# Model studencki z numerem albumu
class CustomUser(AbstractUser):
    """
    @class CustomUser
    @brief Rozszerzony model użytkownika.
    
    Dodaje pole numeru albumu do domyślnego użytkownika Django. Pozwala na identyfikację studentów po numerze albumu.
    """
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
    """
    @class Subject
    @brief Model przedmiotu z planu zajęć.
    
    Reprezentuje pojedynczy przedmiot przypisany do użytkownika, wraz z informacjami o formie zajęć, czasie trwania i statusie opanowania materiału.
    """
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
    """
    @class Material
    @brief Materiały do nauki dla przedmiotu.
    
    Przechowuje pliki, linki i opisy materiałów edukacyjnych powiązanych z przedmiotem. Obsługuje status przetwarzania plików PDF oraz komunikaty o błędach.
    """
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
    """
    @class StudySession
    @brief Historia sesji nauki z AI dla przedmiotu.
    
    Zawiera zapis pytań i odpowiedzi z sesji nauki, powiązanych z użytkownikiem i przedmiotem. Pozwala śledzić czas trwania i typ wiadomości.
    """
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
    """
    @class Profile
    @brief Profil użytkownika.
    
    Przechowuje dodatkowe informacje o użytkowniku, takie jak data ostatniej aktualizacji planu zajęć.
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    last_schedule_update = models.DateTimeField(null=True, blank=True)


    def __str__(self):
        return f"Profil użytkownika: {self.user.username}"
    
# QUIZY
class Quiz(models.Model):
    """
    @class Quiz
    @brief Model pojedynczego quizu.
    
    Reprezentuje quiz powiązany z przedmiotem i użytkownikiem, przechowuje czas generowania oraz datę utworzenia.
    """
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    generation_timelapse = models.DurationField(null=True, blank=True, verbose_name="Czas generowania quizu")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quizzes')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Quiz: {self.title} ({self.subject.name}) - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class QuizQuestion(models.Model):
    """
    @class QuizQuestion
    @brief Model pytania w quizie.
    
    Przechowuje treść pytania, poprawną odpowiedź, dystraktory oraz wyjaśnienie odpowiedzi w ramach quizu.
    """
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    correct_answer = models.TextField()
    distractors = models.JSONField(default=list)
    explanation = models.TextField(blank=True, verbose_name="Wyjaśnienie odpowiedzi")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Pytanie: {self.question_text[:50]}..."