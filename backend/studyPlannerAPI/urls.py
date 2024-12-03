from django.urls import path
from studyPlannerAPI import views

urlpatterns = [
    path("", views.model_requests_list),
    path("requests/<int:pk>/", views.model_request_details),
]
