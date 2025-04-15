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
from django.contrib import admin
from rest_framework.documentation import include_docs_urls
from studyPlannerAPI import views
from studyPlannerAPI.views import root_view, subject_assistant
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.conf import settings
from django.conf.urls.static import static
from studyPlannerAPI.views import chat_history, activate_account
from rest_framework_simplejwt.views import TokenRefreshView

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
    path('admin/', admin.site.urls),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path("", root_view, name='api-root'),
    path("requests/<int:pk>/", views.model_request_details),
    # Dokumentacja Swagger
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path("subjects/", views.get_subjects, name='get_subjects'),
    path("verify-album-number/", views.verify_album_number, name='verify_album_number'),
    path('subjects/<int:pk>/mastered/', views.toggle_subject_mastered, name='toggle_subject_mastered'),
    path('subjects/<int:subject_id>/materials/', views.materials, name='subject_materials'),
    path('subjects/<int:subject_id>/materials/<int:material_id>/download/', views.material_download, name='material_download'),
    path('subjects/<int:subject_id>/materials/<int:material_id>/', views.material_delete, name='material_delete'),
    path('subject/<int:subject_id>/assistant/', subject_assistant, name='subject_assistant'),
    path('subject/<int:subject_id>/chat-history/', chat_history, name='get_chat_history'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('materials/get_all_materials/', views.get_all_materials, name='get_all_materials'),
    path('task/<str:task_id>/', views.check_assistant_task, name='check_task'),
    path('activate/<str:uidb64>/<str:token>/', activate_account, name='activate_account'),
    path('/check-if-album-number-exists', views.check_if_album_number_exists, name='check_if_album_number_exists'),

]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
