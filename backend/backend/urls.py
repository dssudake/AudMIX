"""

AudMIX backend URL Configuration

"""

from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="AudMIX Webapp Backend API",
        default_version='v1',
        description="Documentation of API Endpoints for AudMIX Backend web-application",
        terms_of_service="https://www.google.com/policies/terms/",
        license=openapi.License(name="GPLv3 License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('api/admin/', admin.site.urls),

    # Auth API Routes
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),

    # Audio Processing API Routes
    path('api/', include('processAPI.urls')),

    # Endpoint to check celery worker task progress
    path('api/task_status/', include('celery_progress.urls')),

    # Swagger API Documentation
    path('api/docs/', schema_view.with_ui('swagger',
         cache_timeout=0), name='schema-swagger-ui'),
]

# to load static/media files in development environment
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
