from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse

from processAPI.models import AudioFile
from processAPI.serializers import AudioFileSerializer


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
        serializer = AudioFileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
