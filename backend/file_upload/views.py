from rest_framework import viewsets
from django.http import HttpResponse
from .serializers import uploadSerializer
from .models import upload

class MediaViewSet(viewsets.ModelViewSet):
  queryset = upload.objects.all()
  serializer_class = uploadSerializer