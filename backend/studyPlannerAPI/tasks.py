from celery import shared_task
from celery.exceptions import Ignore
from django.utils import timezone
from .models import Subject, StudySession, Material
from studyPlanner.services import AIServiceFactory
from .conversation_context import ConversationContext
import os

# operacje na plikach
import fitz
from django.core.files.storage import default_storage

@shared_task(bind=True, max_retries=3)
def process_ai_assistant_request(self, subject_id, user_id, question, model_name='deepseek'):
    """Przetworzenie zapytania do asystenta AI w tle"""
    try:
        subject = Subject.objects.get(id=subject_id, user_id=user_id)

        api_key = os.getenv('DEEPSEEK_API_KEY')
        if not api_key:
            raise ValueError("Brak klucza API Deepseek")

        ai_service = AIServiceFactory.create_service(model_name=model_name)

        # historia konwersacji
        conversation_history = ConversationContext.get_conversation_history(
            user_id=user_id,
            subject_id=subject_id
        )

        result = ai_service.generate_study_assistant_response(
            subject_name=subject.name,
            question=question,
            subject_type=subject.lesson_form,
            conversation_history=conversation_history
        )

        if isinstance(result, dict) and 'response' in result and 'elapsed_time' in result:
            response = result['response']
            elapsed_time = result['elapsed_time']
        else:
            response = result
            elapsed_time = None

        # Zapisanie sesji nauki
        study_session = StudySession.objects.create(
            user_id=user_id,
            subject=subject,
            questions=question,
            answers=response,
            elapsed_time=elapsed_time,
            created_at=timezone.now(),
            ai_model=model_name,
        )

        # Dodanie do historii konwersacji
        ConversationContext.add_to_conversation_history(
            user_id=user_id,
            subject_id=subject_id,
            question=question,
            answer=response
        )

        return {
            "id": study_session.id,
            "subject": subject.name,
            "question": question,
            "answer": response,
            "timestamp": study_session.created_at.isoformat(),
            "elapsed_time": elapsed_time,
            "model": model_name
        }

    except Subject.DoesNotExist:
        raise self.retry(exc=Exception("Przedmiot nie istnieje"), countdown=5)
    except Exception as e:
        raise self.retry(exc=e, countdown=10)


@shared_task(bind=True, max_retries=3)
def process_uploaded_pdf(self, material_id):
    """Asynchroniczne przetwarzanie przesłanego pliku PDF"""
    material = None
    task_id = self.request.id
    print(f"Task ID: {task_id} - Rozpoczęcie przetwarzania pliku PDF o ID: {material_id}")

    try:
        try:
            # pobranie materiału
            material = Material.objects.get(id=material_id)
            print(f"Task ID: {task_id} - Pobranie materiału o ID: {material.id}")
        except Material.DoesNotExist:
            print(f"Task ID: {task_id} - Materiał o ID {material_id} nie istnieje")
            raise Ignore()

        # sprawdzenie czy materiał to plik
        if not material.file or not material.file.name.endswith('.pdf'):
            raise ValueError("Brak pliku do przetworzenia lub plik nie jest PDF")

        material.processing_status = 'processing'  # przejście do stanu przetwarzania
        material.error_message = None  # wyczyszczenie komunikatu o błędzie
        material.save(update_fields=['processing_status', 'error_message'])  # aktualizacja statusu w bazie danych
        print(f"Task ID: {task_id} - Rozpoczęcie przetwarzania pliku PDF o ID: {material.id}")

        # TODO: Przetwarzanie pliku PDF

        # Ekstrakcja tekstu
        print(f"Task ID: {task_id} - [1] Ekstrakcja tekstu z pliku PDF")
        extracted_text = None
        doc = None
        try:
            print(f"Task ID: {task_id} - [1.1] Otwieranie pliku PDF")
            with default_storage.open(material.file.name, 'rb') as pdf_file:
                pdf_data = pdf_file.read()
                if not pdf_data:
                    raise ValueError("Nie można odczytać danych z pliku PDF")
                doc = fitz.open(stream=pdf_data, filetype="pdf")

            print(f"Task ID: {task_id} - [1.2] Ekstrakcja tekstu z pliku PDF ({len(doc)} stron)")
            full_text_parts = []
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                page_text = page.get_text("text", sort=True)
                if page_text:
                    full_text_parts.append(page_text.strip())
            extracted_text = "\n\n".join(full_text_parts)

            if not extracted_text:
                # TODO: OCR
                raise ValueError("Nie można znaleźć tekstu w pliku PDF!")
            else:
                print(f"Task ID: {task_id} - [1.3] Ekstrakcja tekstu zakończona ({len(extracted_text)} znaków)")

        except Exception as extraction_error:
            print(f"Task ID: {task_id} - Błąd podczas ekstrakcji tekstu z pliku PDF: {extraction_error}")
            raise extraction_error
        finally:
            if doc:
                try:
                    doc.close()
                    print(f"Task ID: {task_id} - Zamknięcie pliku PDF")
                except Exception as close_error:
                    print(f"Task ID: {task_id} - Błąd podczas zamykania pliku PDF: {close_error}")


        # Dzielenie tekstu na fragmenty
        print(f"Task ID: {task_id} - [2] Dzielenie tekstu na fragmenty")
        chunks = []

        # embedding
        print(f"Task ID: {task_id} - [3] Tworzenie embeddingu")

        # zapis do bazy wektorowej
        print(f"Task ID: {task_id} - [4] Zapis do bazy wektorowej")


        # aktualizacja statusu materiału
        material.processing_status = 'completed'
        material.save(update_fields=['processing_status'])
        print(f"Task ID: {task_id} - Przetwarzanie pliku PDF zakończone pomyślnie")
        return f"Przetwarzanie pliku PDF o ID {material.id} zakończone pomyślnie"

    except Ignore:
        raise
    except Exception as e:
        error_message = f"Błąd w zadaniu {task_id}: {str(e)}"
        print(f"Task ID: {task_id} - {error_message}")

        if material and isinstance(material, Material):
            material.processing_status = 'failed'
            material.error_message = str(e)[:1000]
            material.save(update_fields=['processing_status', 'error_message'])
            print(f"Task ID: {task_id} - Zaktualizowano status materiału o ID {material.id} na 'failed'")
        else:
            print(f"Task ID: {task_id} - Nie można zaktualizować statusu materiału, ponieważ nie został znaleziony")

        try:
            countdown = 60 * (2 ** self.request.retries)
            print(f"Task ID: {task_id} - Ponowne próby w {countdown} sekund")
            raise self.retry(exc=e, countdown=countdown)
        except self.MaxRetriesExceededError:
            final_error_message = f"Zadanie {task_id} nie powiodło się po maksymalnej liczbie prób"
            print(f"Task ID: {task_id} - {final_error_message}")
            return final_error_message