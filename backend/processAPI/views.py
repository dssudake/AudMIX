from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse

from processAPI.models import AudioFile
from processAPI.serializers import AudioFileSerializer
from processAPI.tasks import preprocess_audio


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
