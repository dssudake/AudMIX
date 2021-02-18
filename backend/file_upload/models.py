from django.db import models

def upload_path(instance,filename):
    return '/'.join(['user audio',str(instance.Name),filename])

class upload(models.Model):
    Name=models.CharField(max_length=200)
    File=models.FileField(upload_to=upload_path)
