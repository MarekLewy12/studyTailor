from abc import abstractmethod
from time import perf_counter

import openai
import pandas as pd
import requests
from datetime import datetime, timedelta

from openai import OpenAI
from tabulate import tabulate
import json
import os
from django.conf import settings


class StudyPlanner:
    def __init__(self, model="gpt-4o", temperature=0.5):
        """
        Inicjalizacja z kluczem API OpenAI.
        """
        self.last_prompt = None
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError(
                "Brak klucza API OpenAI. Upewnij się, że zmienna środowiskowa OPENAI_API_KEY jest ustawiona."
            )
        self.client = openai.OpenAI(api_key=api_key)
        self.endpoint = "https://plan.zut.edu.pl/schedule_student.php"
        self.model = model
        self.temperature = temperature

    def get_schedule(self, album_number: str):
        """
        Pobiera plan zajęć na tydzień do przodu na podstawie numeru albumu z endpointa uczelnianego.
        """
        # od dnia jutrzejszego
        start_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        end_date = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
        params = {"number": album_number, "start": start_date, "end": end_date}
        response = requests.get(self.endpoint, params=params)
        if response.status_code == 200:
            raw_schedule = response.json()
            if not raw_schedule:
                return []
            filtered_schedule = [  # Filtruje wykłady z harmonogramu
                {
                    "subject": entry["subject"],
                    "lesson_form": entry["lesson_form"].lower(),
                    "start_datetime": datetime.fromisoformat(entry["start"]),
                    "end_datetime": datetime.fromisoformat(entry["end"]),
                    "start": datetime.fromisoformat(entry["start"]).strftime(
                        "%A %H:%M"
                    ),
                    "end": datetime.fromisoformat(entry["end"]).strftime("%H:%M"),
                }
                for entry in raw_schedule[1:]
            ]
            return filtered_schedule
        else:
            raise ConnectionError(
                f"Nie udało się pobrać danych. Kod błędu: {response.status_code}"
            )

    def display_subjects(self, schedule):
        """
        Wyświetla listę przedmiotów z podziałem na różne formy zajęć.
        """
        schedule_df = pd.DataFrame(schedule)
        forms = ["wykład", "laboratorium", "audytoryjne", "lektorat", "projekt"]
        result = {}

        for form in forms:
            filtered = schedule_df[schedule_df["lesson_form"] == form]
            if not filtered.empty:
                # print(f"\n{form.capitalize()}:")
                # print(
                #     tabulate(
                #         filtered[["subject", "start", "end"]],
                #         headers="keys",
                #         tablefmt="psql",
                #         showindex=False,
                #     )
                # )
                result[form] = (
                    filtered[["subject", "lesson_form"]]
                    .drop_duplicates()
                    .to_dict(orient="records")
                )

        return result

    def get_user_preferences(self, subjects):
        """
        Ulepszona metoda zbierania preferencji użytkownika.
        """
        print("\nWszystkie przedmioty w tym tygodniu:")
        all_subjects = list(
            set([subj["subject"] for sublist in subjects.values() for subj in sublist])
        )
        subject_dict = {str(i + 1): subj for i, subj in enumerate(all_subjects)}

        # Wyświetl numerowaną listę przedmiotów
        print(
            tabulate(
                [(k, v) for k, v in subject_dict.items()],
                headers=["Nr", "Przedmiot"],
                tablefmt="psql",
            )
        )

        # Użytkownik wybiera trudne przedmioty i przedmioty do wykluczenia
        difficulties_input = input(
            "Podaj numery trudnych przedmiotów (oddzielone przecinkami): "
        ).split(",")
        exclusions_input = input(
            "Podaj numery przedmiotów do wykluczenia (oddzielone przecinkami): "
        ).split(",")

        # Zamiana numerów na nazwy przedmiotów
        difficulties = [
            subject_dict.get(num.strip())
            for num in difficulties_input
            if num.strip() in subject_dict
        ]
        exclusions = [
            subject_dict.get(num.strip())
            for num in exclusions_input
            if num.strip() in subject_dict
        ]

        # Informacje o wolnym weekendzie
        free_weekend = (
            input("Czy masz wolny weekend? (tak/nie): ").strip().lower() == "tak"
        )

        # Preferowane pory dnia do nauki
        print("\nWybierz preferowane pory dnia do nauki.")
        time_options = {
            "1": {"label": "rano", "start": "06:00", "end": "10:00"},
            "2": {"label": "południe", "start": "10:00", "end": "14:00"},
            "3": {"label": "popołudnie", "start": "14:00", "end": "18:00"},
            "4": {"label": "wieczór", "start": "18:00", "end": "22:00"},
            "5": {"label": "cały dzień", "start": "8:00", "end": "22:00"},
        }

        for k, v in time_options.items():
            print(f"{k}: {v['label']} ({v['start']} - {v['end']})")
        time_preferences_input = input(
            "Podaj numery preferowanych pór dnia (oddzielone przecinkami): "
        ).split(",")
        time_preferences = [
            time_options.get(num.strip())
            for num in time_preferences_input
            if num.strip() in time_options
        ]

        # Tematy do nauki dla wybranych przedmiotów
        print(
            "\nPodaj numery przedmiotów, dla których chcesz dodać tematy do nauki (oddzielone przecinkiem)."
        )
        selected_input = input("Podaj numery przedmiotów: ").split(",")
        selected_subjects = [
            subject_dict.get(num.strip())
            for num in selected_input
            if num.strip() in subject_dict
        ]

        # Pobieranie tematów do nauki
        subject_topics = {}
        for subject in selected_subjects:
            topics = input(
                f"Podaj konkretne tematy do nauki z przedmiotu {subject} oddzielone przecinkami: "
            ).split(",")
            subject_topics[subject] = [
                topic.strip() for topic in topics if topic.strip()
            ]

        return {
            "difficult_subjects": [subj for subj in difficulties if subj],
            "excluded_subjects": [subj for subj in exclusions if subj],
            "free_weekend": free_weekend,
            "time_preferences": time_preferences,
            "subject_topics": subject_topics,
        }

    def generate_study_plan(self, schedule, preferences):
        """
        Generuje harmonogram nauki przy użyciu modelu AI (ChatGPT).
        """

        preferences = {
            "difficult_subjects": [],
            "excluded_subjects": [],
            "free_weekend": True,
            "time_preferences": [],
            "subject_topics": {},
        }

        curr_date = datetime.now().strftime("%Y-%m-%d")

        # filtrowanie wykładów i zajęć z tego samego dnia z harmonogramu
        schedule_no_lectures = [
            entry for entry in schedule if entry["lesson_form"] != "wykład"
        ]

        plan_text = "\n".join(
            [
                f"{entry['subject']} | {entry['lesson_form']} | {entry['start_datetime'].strftime('%Y-%m-%d %H:%M')} - {entry['end_datetime'].strftime('%H:%M')}"
                for entry in schedule_no_lectures
            ]
        )

        # tematy do nauki
        subject_topics_text = "\n".join(
            [
                f"{subject}: {', '.join(topics)}"
                for subject, topics in preferences["subject_topics"].items()
            ]
        )

        # Aktualna data
        current_date = datetime.now().strftime("%Y-%m-%d")

        # Aktualna godzina
        current_time = datetime.now().strftime("%H:%M")

        time_preferences_text = "\n".join(
            [
                f"- {tp['label']} od {tp['start']} do {tp['end']}"
                for tp in preferences["time_preferences"]
            ]
        )

        prompt = f"""
        Twoim zadaniem jest wygenerowanie planu nauki na następny tydzień w formacie JSON.

        Oto plan zajęć (bez wykładów):
        Przedmiot | Forma zajęć | Data i godzina zajęć
        {plan_text}

        Preferencje użytkownika:
        - Trudne przedmioty:
        {', '.join(preferences['difficult_subjects']) or 'Brak'}
        - Wykluczone przedmioty:
        {', '.join(preferences['excluded_subjects']) or 'Brak'}
        - Wolny weekend: {"tak" if preferences['free_weekend'] else "nie"}
        - Preferowane pory dnia do nauki (wybieraj godziny losowo w ramach tych przedziałów):
        {time_preferences_text or 'Brak'}
        - Tematy do nauki dla poszczególnych przedmiotów:
        {subject_topics_text or 'Brak'}
        
        **WAŻNE INSTRUKCJE:**
        1. **Nie planuj nauki w soboty ani niedziele, jeśli użytkownik nie ma wolnego weekendu (wolny weekend: nie). **W takim przypadku dni nauki mogą być tylko od poniedziałku do piątku**.
        2. Jeśli zajęcia odbywają się w poniedziałek, a dni od poniedziałku do piątku są już zaplanowane lub jest za późno na zaplanowanie nauki, zaplanuj naukę na niedzielę i umieść w odpowiednich polach "details" informację "nauka wymagana w niedzielę".
        3. Jeśli użytkownik ma wolny weekend (wolny weekend: tak), możesz planować naukę również w sobotę i niedzielę.
        4. Aktualna godzina to {current_time}, aktualna data to {current_date}, nie proponuj nauki dzisiaj na godziny wcześniejsze niż aktualna godzina. 

        Wygeneruj plan nauki jako listę obiektów JSON, gdzie każdy obiekt zawiera pola:
        - "subject": nazwa przedmiotu,
        - "lesson_form": forma zajęć (np. "przygotowanie do laboratoriów", "nauka wybranych tematów"),
        - "study_day": data nauki w formacie "YYYY-MM-DD",
        - "study_time": godzina nauki OD DO w formacie "HH:MM - HH:MM", (dobieraj ramy czasowe zgodnie z preferencjami użytkownika, w sposób efektywny),
        - "details": szczegóły (np. tematy do nauki).
        - "class_time": czas zajęć z planu zajęć w formacie: "YYYY-MM-DD HH:MM - HH:MM".
        
        Pamiętaj, aby uwzględnić wszystkie preferencje użytkownika i:
        - Nie planować nauki na dni wcześniejsze niż {current_date}.
        - Dostosuj godziny nauki do preferowanych pór dnia użytkownika, wybierając godziny z podanych przedziałów czasowych.
        - Skup się na przygotowaniu do laboratoriów, ćwiczeń i projektów.
        - Uwzględnij dodatkowy czas na trudne przedmioty.
        - W szczegółach planu uwzględnij konkretne tematy do nauki podane przez użytkownika.
        - **Jeśli nie podano tematów do nauki dla przedmiotu, pozostaw pole "details" puste lub wpisz "Brak szczegółów".**
        - Nie planuj nauki na przedmioty wykluczone przez użytkownika.
        - Sortuj dni nauki od najbliższego do najdalszego.
        - Upewnij się, że w polu "class_time" dla każdego przedmiotu umieścisz czas zajęć z planu do którego student powinien się przygotować.
        
        Pamiętaj! **Planuj naukę efektywnie, w taki sposób żeby dni nauki nie były zbyt oddalone od dni zajęć.**

        Odpowiedz tylko w formacie JSON, bez dodatkowego tekstu.
        Upewnij się, że odpowiedź NIE zawiera znaczników bloków kodu ani innych dodatkowych znaków. Odpowiedz tylko czystym JSON-em.
        Upewnij się, że odpowiedź jest poprawnym, walidowanym JSON-em. Usuń zbędne przecinki, zamknij listy i obiekty poprawnie.
        """

        self.last_prompt = prompt

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "Jesteś asystentem do planowania nauki."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=1024,
            temperature=self.temperature,
        )

        # Przetworzenie odpowiedzi jako JSON
        study_plan_json = response.choices[0].message.content.strip()

        # Jeśli występują, usunięcie znaczników bloków kodu
        if study_plan_json.startswith("```json"):
            study_plan_json = study_plan_json[7:]  # Usunięcie znacznika początkowego
        if study_plan_json.endswith("```"):
            study_plan_json = study_plan_json[:-3]  # Usunięcie znacznika końcowego

        # print("\nDane zwrócone przez model:")
        # print(study_plan_json)  # Wyświetlenie surowych danych JSON

        try:
            study_plan_data = json.loads(study_plan_json)

            if isinstance(study_plan_data, dict) and "study_plan" in study_plan_data:
                study_plan_data = study_plan_data["study_plan"]

            # informacje diagnostyczne
            # print("\nStruktura danych po załadowaniu JSON:")
            # print(json.dumps(study_plan_data, ensure_ascii=False, indent=4))

            # study_plan = pd.DataFrame(study_plan_data)
        except json.JSONDecodeError as e:
            # print(f"Błąd dekodowania JSON: {e}")
            raise ValueError("Model AI zwrócił niepoprawny JSON.")

        return json.dumps(study_plan_data)

    def display_schedule(self, study_plan):
        """
        Wyświetla harmonogram w formie tabeli.
        """
        col_mapping = {
            "subject": "Przedmiot",
            "lesson_form": "Forma zajęć",
            "study_day": "Dzień nauki",
            "study_time": "Godzina nauki",
            "details": "Szczegóły",
            "class_time": "Czas zajęć",
        }

        # Sprawdzenie czy wszystkie kolumny istnieją
        missing_cols = [col for col in col_mapping if col not in study_plan.columns]
        if missing_cols:
            print(f"Brakujące kolumny w danych: {missing_cols}")
            return

        study_plan.rename(columns=col_mapping, inplace=True)

        print("\nHarmonogram nauki:")
        print(tabulate(study_plan, headers="keys", tablefmt="psql", showindex=False))


class AIModelService:
    """Klasa abstrakcyjna definiująca interfejs dla serwisów AI, Deepseek oraz GPT4o"""

    def __init__(self, api_key=None):
        self.api_key = api_key or self._get_default_api_key()
        if not self.api_key:
            raise ValueError(f"Brak klucza API dla {self.__class__.__name__}")
        self.client = self._initialize_client()

    @abstractmethod
    def _get_default_api_key(self):
        """Pobranie klucza API"""
        pass

    @abstractmethod
    def _initialize_client(self):
        """Inicjalizacja klienta API"""
        pass

    @abstractmethod
    def _get_model_name(self):
        """Zwraca nazwę modelu używanego w zapytaniach API"""
        pass

    def generate_response(self, prompt, system_prompt=None, conversation_history=None,
                          temperature=0.7, max_tokens=2048):
        """Generowanie odpowiedzi od wybranego modelu AI"""
        if system_prompt is None:
            system_prompt = "Jesteś pomocnym asystentem nauki, który udziela rzeczowych i dokładnych odpowiedzi."

        try:
            # instrukcja systemowa
            messages = [{"role": "system", "content": system_prompt}]

            # historia konwersacji
            if conversation_history and isinstance(conversation_history, list):
                messages.extend(conversation_history)

            # pytanie użytkownika
            messages.append({"role": "user", "content": prompt})

            t1_start = perf_counter()
            response = self.client.chat.completions.create(
                model=self._get_model_name(),  # użycie nazwy modelu
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature
            )
            t1_stop = perf_counter()

            elapsed_time = t1_stop - t1_start

            return {
                "response": response.choices[0].message.content.strip(),
                "elapsed_time": elapsed_time
            }

        except Exception as e:
            print(f"Błąd podczas komunikacji z API {self.__class__.__name__}: {str(e)}")
            return {
                "response": "Przepraszam, wystąpił problem z połączeniem do asystenta AI. Spróbuj ponownie później.",
                "elapsed_time": 0
            }

    def generate_study_assistant_response(self, subject_name, question, subject_type=None,
                                          conversation_history=None):
        """
        Wspólna implementacja generowania odpowiedzi asystenta nauki.
        """
        subject_context = f"Przedmiotu: '{subject_name}'"
        if subject_type:
            subject_context += f" ({subject_type})"

        system_prompt = f"""
        Jesteś asystentem nauki specjalizującym się w {subject_context}. 
        Twoje zadanie to pomagać studentom i uczniom w zrozumieniu materiału, wyjaśniać trudne koncepcje 
        i wspierać proces nauki. Udzielaj rzeczowych, dokładnych odpowiedzi opartych na faktach.

        Twój ton powinien być:
        - Profesjonalny, ale przyjazny
        - Pomocny i cierpliwy
        - Jasny i zwięzły, ale dokładny

        Jeśli nie znasz odpowiedzi na pytanie, przyznaj to zamiast wymyślać informacje.
        Używaj przykładów, gdy to pomocne.

        Formatuj wzory matematyczne używając składni LaTeX:
        - Dla wzorów inline użyj $wzór$
        - Dla wzorów w osobnej linii użyj $$wzór$$
        Pisz zwięźnie i strukturalnie, dzieląc dłuższe wyjaśnienia na akapity.

        Odpowiadaj w języku polskim.
        """

        prompt = f"Jako student uczący się {subject_context}, mam następujące pytanie: {question}"

        return self.generate_response(prompt, system_prompt=system_prompt, conversation_history=conversation_history)


class DeepseekAIService(AIModelService):
    """
    Deepseek-chat
    """
    def _get_default_api_key(self):
        return os.getenv('DEEPSEEK_API_KEY')

    def _initialize_client(self):
        return OpenAI(
            api_key=self.api_key,
            base_url="https://api.deepseek.com/"
        )

    def _get_model_name(self):
        return "deepseek-chat"


class GPT4oService(AIModelService):
    """
    GPT-4o
    """

    def _get_default_api_key(self):
        return os.getenv('OPENAI_API_KEY')

    def _initialize_client(self):
        return OpenAI(api_key=self.api_key)

    def _get_model_name(self):
        return "gpt-4o"


class AIServiceFactory:
    """
    Fabryka tworząca odpowiedni serwis AI na podstawie wybranego modelu.
    """

    @staticmethod
    def create_service(model_name, api_key=None):
        """
        Tworzy instancję serwisu AI na podstawie nazwy modelu

        Args:
            model_name (str): Nazwa modelu, np. 'deepseek', 'gpt-4o'
            api_key (str, optional): Opcjonalny klucz API

        Returns:
            AIModelService: Instancja serwisu AI

        Raises:
            ValueError: Jeśli podano nieprawidłową nazwę modelu
        """
        if model_name.lower() == 'deepseek':
            return DeepseekAIService(api_key)
        elif model_name.lower() == 'gpt-4o':
            return GPT4oService(api_key)
        else:
            raise ValueError(f"Nieznany model AI: {model_name}")

