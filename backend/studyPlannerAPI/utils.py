from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
import logging
from qdrant_client import QdrantClient, models

logger = logging.getLogger(__name__)

_qdrant_client_instance = None


def initialize_qdrant_client():
    """Inicjalizacja klienta Qdrant"""
    global _qdrant_client_instance

    if _qdrant_client_instance:
        try:
            # sprawdzenie czy zainicjalizowany klient jest poprawny i w ogóle działa
            _qdrant_client_instance.get_collections()
            logger.debug("Reużywanie istniejącego klienta Qdrant")
            return _qdrant_client_instance
        except Exception as e:
            logger.warning("Nie można połączyć się z istniejącym klientem Qdrant: %s", e)
            _qdrant_client_instance = None  # resetowanie instancji, aby utworzyć nową

    # sprawdzenie czy zmienne środowiskowe są ustawione i czy są poprawne
    if not settings.QDRANT_URL or not settings.QDRANT_API_KEY:
        logger.error("Nie można zainicjalizować klienta Qdrant: brak zmiennych środowiskowych")
        raise ValueError("Nie można zainicjalizować klienta Qdrant: brak zmiennych środowiskowych")

    logger.info(f"Inicjalizowanie klienta Qdrant z URL: {settings.QDRANT_URL}")
    try:
        client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY,
            timeout=60
        )

        # Sprawdzenie czy klient działa
        client.get_collections()
        logger.info(f"Pomyślnie połączono z Qdrant: {settings.QDRANT_URL}")
        _qdrant_client_instance = client

        return client
    except Exception as e:
        logger.error(f"Błąd podczas łączenia z Qdrant: {settings.QDRANT_URL}")
        raise ConnectionError(f"Błąd podczas łączenia z Qdrant: {e}")

def ensure_qdrant_collection():
    """Upewnienie, że kolekcja Qdrant istnieje i ewentualne utworzenie jej"""
    try:
        client = initialize_qdrant_client()
    except ConnectionError as connection_error:
        logger.error(f"Błąd podczas inicjalizacji klienta Qdrant: {connection_error}")
        raise

    collection_name = settings.QDRANT_COLLECTION_NAME
    vector_size = settings.QDRANT_VECTOR_SIZE
    distance_metric_str = settings.QDRANT_DISTANCE_METRIC.upper()

    try:
        distance = models.Distance[distance_metric_str]
    except KeyError:
        logger.error(f"Nieznana metryka odległości: {distance_metric_str}")
        raise ValueError(f"Nieznana metryka odległości: {distance_metric_str}")
    except AttributeError:
        logger.error("Brak ustawienia QDRANT_DISTANCE_METRIC w settings.py.")
        raise ValueError("Brak ustawienia QDRANT_DISTANCE_METRIC w settings.py")

    try:
        # Sprawdzenie czy kolekcja już istnieje
        client.get_collection(collection_name)
        logger.info(f"Kolekcja {collection_name} już istnieje.")
    except Exception as e:
        logger.warning(f"Kolekcja {collection_name} nie istnieje, tworzenie nowej: {e}")
        try:
            client.create_collection(
                collection_name=collection_name,
                vectors_config=models.VectorParams(
                    size=vector_size,
                    distance=distance
                ),
            )
            logger.info(f"Kolekcja {collection_name} została pomyślnie utworzona.")
        except Exception as create_error:
            error_str = str(create_error).lower()
            if "already exists" or "exist" in error_str:
                logger.warning(f"Kolekcja {collection_name} już istnieje, prawdopodobnie utworzył ją inny worker.")
            else:
                logger.error(f"Błąd podczas tworzenia kolekcji {collection_name}: {create_error}")
                raise ConnectionError(f"Nie udało się utworzyć kolekcji Qdrant: {create_error}")


class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            str(user.pk) + str(timestamp) + str(user.is_active)
        )

account_activation_token = AccountActivationTokenGenerator()

def generate_activation_link(user, domain):
    """Link aktywacyjny do konta"""
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = account_activation_token.make_token(user)
    return f"http://{domain}/activate/{uid}/{token}/"