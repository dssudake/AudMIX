import os
import uuid

from django.db import models
from django.conf import settings


def create_with_pk(self):
    """
    Create the AudioFile Object if not created initially
    """
    instance = self.create()
    instance.save()
    return instance


def get_file_path(instance, filename):
    """
    Get path of uploaded audio file
    Audio file will be stored in "user_media/{id}/audio.{ext}" in media directory
    """
    if not instance.pk:
        create_with_pk(instance)
    uid = str(instance.pk)
    ext = filename.split('.')[-1]
    return os.path.join(settings.AUDIO_PROCESSING_ROOT, uid, settings.AUDIO_PROCESSING_AUDIO_FILE_NAME + '.' + ext)


class AudioFile(models.Model):
    """
    This model holds audio uploaded by user
    after uploading, a unique id will be allotted.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    audio = models.FileField(upload_to=get_file_path)
    processed_audio = models.FileField()

    def __str__(self):
        return str(self.name)

    class Meta:
        ordering = ('-created_at', '-modified_at')
