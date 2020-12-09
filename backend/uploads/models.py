from django.db import models

def upload_path(instance,filename):
    return '/'.join(['user audio',str(instance.name),filename])
# Create your models here.
class upload(models.Model):
    name=models.CharField(max_length=32)
    audio=models.FileField(upload_to=upload_path)
