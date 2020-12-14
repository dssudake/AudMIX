"""

AudMIX backend URL Configuration

"""

from django.contrib import admin
from django.urls import path,include
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
    path('admin/', admin.site.urls),
    path('api/',include('file_upload.urls')),
    path('api/docs/', schema_view.with_ui('swagger',cache_timeout=0), name='schema-swagger-ui'),
]

urlpatterns+=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)