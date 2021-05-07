from django.db import models
import uuid


class upload(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    Name = models.CharField(max_length=200)
    UploadedAt = models.DateTimeField(auto_now_add=True)
    File = models.FileField(upload_to='user_media/%Y/%m/%d')
