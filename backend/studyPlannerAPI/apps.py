from django.apps import AppConfig


class StudyplannerapiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'studyPlannerAPI'

    def ready(self):
        import studyPlannerAPI.signals
