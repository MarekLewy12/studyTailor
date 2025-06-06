"""
URL configuration for studyPlanner project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from studyPlannerAPI import views
from studyPlannerAPI.views import root_view
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="StudyTailor API",
        default_version="v1",
        description="API do generowania planów nauki",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@studyplanner.local"),
        license=openapi.License(name="BSD License"),
    ),
        public=True,
        permission_classes=[permissions.AllowAny],
    )

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path("", root_view, name='api-root'),
    path("requests/<int:pk>/", views.model_request_details),
    # Dokumentacja Swagger
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
