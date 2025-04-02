from celery import shared_task
from django.utils import timezone
from .models import Subject, StudySession
from studyPlanner.services import DeepseekAIService
from .conversation_context import ConversationContext
import os

@shared_task(bind=True, max_retries=3)
def process_ai_assistant_request(self, subject_id, user_id, question):
    """Przetworzenie zapytania do asystenta AI w tle"""
    try:
        subject = Subject.objects.get(id=subject_id, user_id=user_id)

        api_key = os.getenv('DEEPSEEK_API_KEY')
        if not api_key:
            raise ValueError("Brak klucza API Deepseek")

        ai_service = DeepseekAIService(api_key)

        # historia konwersacji
        conversation_history = ConversationContext.get_conversation_history(
            user_id=user_id,
            subject_id=subject_id
        )

        result = ai_service.generate_study_assistant_response(
            subject_name = subject.name,
            question = question,
            subject_type= subject.lesson_form,
            conversation_history = conversation_history
        )

        if isinstance(result, dict) and 'response' in result and 'elapsed_time' in result:
            response = result['response']
            elapsed_time = result['elapsed_time']
        else:
            answer = result
            elapsed_time = None

        # Zapisanie sesji nauki
        study_session = StudySession.objects.create(
            user_id=user_id,
            subject=subject,
            questions=question,
            answers=response,
            elapsed_time=elapsed_time,
            created_at=timezone.now()
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
            "answer": answer,
            "timestamp": study_session.created_at.isoformat(),
            "elapsed_time": elapsed_time,
        }

    except Subject.DoesNotExist:
        raise self.retry(exc=Exception("Przedmiot nie istnieje"), countdown=5)
    except Exception as e:
        raise self.retry(exc=e, countdown=10)
