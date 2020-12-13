from rest_framework import viewsets
from .models import upload
from .serializers import mediaserializer


class MediaViewSet(viewsets.ModelViewSet):
    queryset=upload.objects.all()
    print(queryset)
    serializer_class=mediaserializer
