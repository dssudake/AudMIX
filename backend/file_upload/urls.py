from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MediaViewSet

router = DefaultRouter()
router.register("upload", MediaViewSet, basename='Upload')

urlpatterns = [
    path('', include(router.urls))
]
