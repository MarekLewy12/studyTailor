from django.urls import path
from studyPlannerAPI import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),  # Endpoint dla rejestracji użytkownika
    path('login/', views.login_view, name='login'),  # Endpoint dla logowania użytkownika
    path("", views.model_requests_list),
    path("requests/<int:pk>/", views.model_request_details),
]
