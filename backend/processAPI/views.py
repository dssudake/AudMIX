import os
from django.http import Http404
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from django.conf import settings

from processAPI.models import AudioFile
from processAPI.serializers import AudioFileSerializer
from processAPI.tasks import preprocess_audio, denoise_audio, seperate_audio, crop_and_merge


@api_view(['GET'])
def api_root(request, format=None):
    """
    A single entry point to our REST API routes.
    List all available API routes.
    """
    return Response({
        'audio_list_create': reverse('audio-list-create', request=request, format=format),
    })


class AudioFileListCreate(generics.ListCreateAPIView):
    """
    List all Audio Files or Create a new AudioFile entry.
    """
    queryset = AudioFile.objects.all()
    serializer_class = AudioFileSerializer

    def create(self, request):
        """
        Create a new AudioFile instance
        """
        audio_file_ext = "." + str(request.data['audio']).split('.')[-1]
        serializer = AudioFileSerializer(data=request.data)
        if serializer.is_valid():
            obj = serializer.save()
            preprocess_audio.delay(obj.id, audio_file_ext)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AudioFileDetail(generics.RetrieveAPIView):
    """
    Retrieve existing AudioFile details.
    """
    queryset = AudioFile.objects.all()
    serializer_class = AudioFileSerializer


class AudioReduceNoise(APIView):
    """
    Noise reduction from audio file
    - Assign celery task to Process Audio
    - Return celery task_id in response
    """

    def get_object(self, pk):
        try:
            return AudioFile.objects.get(pk=pk)
        except AudioFile.DoesNotExist:
            raise Http404

    def put(self, request, pk):
        task = denoise_audio.delay(pk)
        res_dict = {
            'task_id': task.id,
            'audio_id': pk
        }
        return Response(res_dict, status=status.HTTP_201_CREATED)


class AudioSeparate(APIView):
    """
    Seperate vocals and music from songs
    - Assign celery task to Seperate Audio
    - Return celery task_id in response
    """

    def put(self, request, pk):
        task = seperate_audio.delay(pk)
        res_dict = {
            'task_id': task.id,
            'audio_id': pk
        }
        return Response(res_dict, status=status.HTTP_201_CREATED)


class AudioCrop(APIView):
    """
    Seperate vocals and music from songs
    - Assign celery task to Seperate Audio
    - Return celery task_id in response
    """

    def put(self, request, pk):
        name = request.data['name']
        segments = request.data['Segments']

        task = crop_and_merge.delay(pk, name, segments)
        res_dict = {
            'task_id': task.id,
            'audio_id': pk
        }
        return Response(res_dict, status=status.HTTP_201_CREATED)


class AudioReset(APIView):
    """
    Seperate vocals and music from songs
    - Assign celery task to Seperate Audio
    - Return celery task_id in response
    """

    def put(self, request, pk):
        name = request.data['name']
        audio_file = AudioFile.objects.get(pk=pk)
        print(name)
        if(name == 'Original Audio'):
            audio_file.audio = os.path.join(
                settings.AUDIO_PROCESSING_ROOT, str(pk), 'audio.mp3')
        elif(name == 'Denoised Audio'):
            audio_file.denoised_audio = os.path.join(
                settings.AUDIO_PROCESSING_ROOT, str(pk), 'audio_processed_denoised.wav')
        elif(name == 'Vocals Only'):
            audio_file.vocals_audio = os.path.join(
                settings.AUDIO_PROCESSING_ROOT, str(pk), 'seperated_output', 'audio', 'vocals.mp3')
        elif(name == 'Music only'):
            audio_file.music_audio = os.path.join(
                settings.AUDIO_PROCESSING_ROOT, str(pk), 'seperated_output', 'audio', 'accompaniment.mp3')
        audio_file.save()
        return Response('OK', status=status.HTTP_201_CREATED)
