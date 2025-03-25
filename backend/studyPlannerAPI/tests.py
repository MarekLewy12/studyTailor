from datetime import datetime

from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from .models import CustomUser, Subject, Material
import tempfile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone

from .models import Subject, Material

@override_settings(STORAGES={
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
})

class GetAllMaterialsTestsCase(APITestCase):
    """Testy dla pobierania wszystkich materiałów"""
    def setUp(self):

        # użytkownicy
        self.user1 = CustomUser.objects.create_user(
            username='user1',
            password='password',
            album_number='12345'
        )
        self.user2 = CustomUser.objects.create_user(
            username='user2',
            password='password',
            album_number='54321'
        )

        # przedmioty
        self.subject1 = Subject.objects.create(
            user=self.user1,
            name='Matematyka',
            lesson_form='wykład',
            start_datetime=timezone.make_aware(datetime(2025, 4, 1, 10, 0, 0)),
            end_datetime=timezone.make_aware(datetime(2025, 4, 1, 12, 0, 0))
        )

        self.subject2 = Subject.objects.create(
            user=self.user1,
            name='Fizyka',
            lesson_form='wykład',
            start_datetime=timezone.make_aware(datetime(2025, 4, 1, 14, 0, 0)),
            end_datetime=timezone.make_aware(datetime(2025, 4, 1, 16, 0, 0))
        )

        self.subject3 = Subject.objects.create(
            user=self.user2,
            name='Chemia',
            lesson_form='wykład',
            start_datetime=timezone.make_aware(datetime(2025, 4, 1, 10, 0, 0)),
            end_datetime=timezone.make_aware(datetime(2025, 4, 1, 12, 0, 0))
        )

        self.subject4 = Subject.objects.create(
            user=self.user2,
            name='Biologia',
            lesson_form='wykład',
            start_datetime=timezone.make_aware(datetime(2025, 4, 1, 14, 0, 0)),
            end_datetime=timezone.make_aware(datetime(2025, 4, 1, 16, 0, 0))
        )

        # materiały
        self.material1 = Material.objects.create(
            subject=self.subject1,
            title="Notatki z wykładu",
            description="Ważne informacje z matematyki",
        )

        self.material2 = Material.objects.create(
            subject=self.subject2,
            title="Dodatkowe materiały",
            description="Link do kursu",
            link="https://example.com/course"
        )

        # materiał z plikiem
        # najpierw należy utworzyć plik tymczasowy
        self.temp_file = tempfile.NamedTemporaryFile(suffix='.pdf')
        self.temp_file.write(b'Test content' * 1000) # ~10kB
        self.temp_file.seek(0)

        temp_file = SimpleUploadedFile(
            name='test_document.pdf',
            content=self.temp_file.read(),
            content_type='application/pdf'
        )

        self.material3 = Material.objects.create(
            subject=self.subject2,
            title="Prezentacja",
            description="Prezentacja z fizyki",
            file=temp_file
        )

        self.material4 = Material.objects.create(
            subject=self.subject3,
            title="Notatki z chemii",
            description="Definicje z chemii",
        )

        self.client = APIClient()

        # url do testowanego endpointu
        self.url = reverse('get_all_materials')

    def tearDown(self):
        """Czyszczenie po testach"""
        # zamknięcie pliku tymczasowego
        if hasattr(self, 'temp_file'):
            self.temp_file.close()

    def test_authentication_required(self):
        """Test, czy wymagane jest uwierzytelnienie"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_materials_user1(self):
        """Test pobierania materiałów użytkownika 1"""
        self.client.force_authenticate(user=self.user1)

        response = self.client.get(self.url)  # wykonanie żądania GET

        # sprawdzenie kodu statusu
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # sprawdzenie liczby zwróconych materiałów
        self.assertEqual(len(response.data['data']), 3)

        # sprawdzenie statystyk
        stats = response.data['stats']
        self.assertEqual(stats['total_count'], 3)  # łączna liczba materiałów
        self.assertEqual(stats['total_count_files'], 1)  # liczba materiałów z plikiem
        self.assertEqual(stats['total_count_links'], 1)  # liczba materiałów z linkiem

        # sprawdzenie danych materiałów
        titles = [item['title'] for item in response.data['data']]
        self.assertIn('Notatki z wykładu', titles)
        self.assertIn('Dodatkowe materiały', titles)
        self.assertIn('Prezentacja', titles)

        self.assertNotIn('Notatki z chemii', titles)


    def test_get_materials_user2(self):
        """Test pobierania materiałów dla drugiego użytkownika"""
        # Uwierzytelniamy użytkownika
        self.client.force_authenticate(user=self.user2)

        # Wykonujemy żądanie
        response = self.client.get(self.url)

        # Sprawdzamy kod statusu
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Sprawdzamy liczbę zwróconych materiałów
        self.assertEqual(len(response.data['data']), 1)

        # Sprawdzamy statystyki
        stats = response.data['stats']
        self.assertEqual(stats['total_count'], 1)
        self.assertEqual(stats['total_count_files'], 0)
        self.assertEqual(stats['total_count_links'], 0)

        # Sprawdzamy czy zwrócony został właściwy materiał
        titles = [item['title'] for item in response.data['data']]
        self.assertIn('Notatki z chemii', titles)

        # Sprawdzamy czy nie ma materiałów pierwszego użytkownika
        self.assertNotIn('Notatki z wykładu', titles)
        self.assertNotIn('Dodatkowe materiały', titles)
        self.assertNotIn('Prezentacja', titles)

    def test_readable_file_size(self):
        """Test funkcji formatującej rozmiar plików"""
        from .views import get_readable_file_size

        self.assertEqual(get_readable_file_size(0), "0B")
        self.assertEqual(get_readable_file_size(500), "500.0 B")
        self.assertEqual(get_readable_file_size(1024), "1.0 KB")
        self.assertEqual(get_readable_file_size(1024 * 1024), "1.0 MB")
        self.assertEqual(get_readable_file_size(1024 * 1024 * 1024), "1.0 GB")



