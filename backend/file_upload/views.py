from rest_framework import viewsets
from django.http import HttpResponse
from .serializers import uploadSerializer
from .models import upload

class MediaViewSet(viewsets.ModelViewSet):
    queryset=upload.objects.all()
    print(queryset)
    serializer_class=uploadSerializer

def post(self,request,*args,**kwargs):
    File=request.data['File']
    Name=request.data['Name']
    upload.objects.create(name=name,File=File)
    return HttpResponse({'message': 'File uploaded'},status=200)
