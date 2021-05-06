from django.urls import path

from processAPI import views

urlpatterns = [
    path('', views.api_root),
    path('upload/', views.AudioFileListCreate.as_view(),
         name='audio-list-create'),
]
