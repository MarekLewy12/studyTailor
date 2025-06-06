from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from studyPlannerAPI import views
from studyPlannerAPI.views import root_view

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),  # Endpoint dla rejestracji użytkownika
    path('login/', views.login_view, name='login'),  # Endpoint dla logowania użytkownika
    path("", root_view, name='api-root'),  # Endpoint dla głównej strony API
    path("requests/<int:pk>/", views.model_request_details),
    path('docs/', include_docs_urls(title='Study Planner API', public=True)),  # Endpoint dla dokumentacji API
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),  # Endpoint dla autoryzacji
]
