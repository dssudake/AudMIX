from django.urls import path

from processAPI import views

urlpatterns = [
    # path('', views.api_root),
    path('upload/', views.AudioFileListCreate.as_view(),
         name='audio-list-create'),
    path('process_audio/<uuid:pk>/', views.AudioFileDetail.as_view(),
         name='audio-detail'),
    path('process_audio/<uuid:pk>/reduce_noise/', views.AudioReduceNoise.as_view(),
         name='audio-reduce-noise'),
    path('process_audio/<uuid:pk>/separate_audio/', views.AudioSeparate.as_view(),
         name='audio-seperate-audio'),
]
