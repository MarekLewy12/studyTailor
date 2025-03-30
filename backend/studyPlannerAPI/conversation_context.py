from django.core.cache import cache
from django.conf import settings
import json
import logging

logger = logging.getLogger(__name__)

class ConversationContext:
    """Klasa do zarządzania kontekstem rozmowy z użyciem cache'a"""

    @staticmethod
    def _get_context_key(user_id, subject_id):
        """Generuje klucz do cache'a na podstawie ID użytkownika i przedmiotu"""
        return f"conversation_context_{user_id}_{subject_id}"

    @classmethod
    def get_conversation_history(cls, user_id, subject_id, limit=5):
        """Pobiera historię konwersacji z cache"""
        key = cls._get_context_key(user_id, subject_id)

        try:
            history_json = cache.get(key)

            if not history_json:
                return []

            history = json.loads(history_json)  # Deserializacja JSON

            # Ograniczenie do ostatnich 'limit' wiadomości
            if len(history) > limit*2:  # *2, ponieważ każda wiadomość to para (pytanie i odpowiedź)
                history = history[-limit*2:]  # Zachowaj tylko ostatnie 'limit' wiadomości

            return history
        except Exception as e:
            logger.error(f"Błąd podczas pobierania historii konwersacji: {e}")
            return []

    @classmethod
    def add_to_conversation_history(cls, user_id, subject_id, question, answer):
        """Dodaje wiadomość do historii konwersacji w cache"""
        key = cls._get_context_key(user_id, subject_id)

        try:
            history_json = cache.get(key)

            if not history_json:
                history = []
            else:
                history = json.loads(history_json)  # Deserializacja JSON

            # Dodanie nowej wiadomości
            history.append({"role": "user", "content": question})
            history.append({"role": "assistant", "content": answer})

            history_json = json.dumps(history)  # serializacja do JSON

            # zapis do cache'a
            cache.set(key, history_json, timeout=settings.CONVERSATION_CONTEXT_TTL)
        except Exception as e:
            logger.error(f"Błąd podczas dodawania wiadomości do historii konwersacji: {str(e)}")

    @classmethod
    def clear_conversation_history(cls, user_id, subject_id):
        """Czyści historię konwersacji w cache"""
        key = cls._get_context_key(user_id, subject_id)
        try:
            cache.delete(key)
        except Exception as e:
            logger.error(f"Błąd podczas czyszczenia historii konwersacji: {e}")