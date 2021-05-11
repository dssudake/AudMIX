import os

from celery import shared_task
from django.conf import settings

from processAPI.models import AudioFile

AUDIO_FILE_NAME = 'audio'
INCOMING_AUDIO_EXTENSION = '.mp3'
PROCESSED_AUDIO_PREFIX = 'processed_audio'
PROCESSED_AUDIO_EXTENSION = '.wav'
AUDIO_SAMPLE_RATE = '44100'
AUDIO_BIT_RATE = '64k'


@shared_task()
def preprocess_audio(audio_id, audio_file_ext):
    """
    Initialize processed_audio with 'wav' format of original audio
    """
    try:
        global INCOMING_AUDIO_EXTENSION
        INCOMING_AUDIO_EXTENSION = audio_file_ext

        folder_path = os.path.join(
            settings.MEDIA_ROOT, settings.AUDIO_PROCESSING_ROOT, audio_id)
        os.chdir(folder_path)

        # convert original audio to wav
        os.system(
            'ffmpeg -hide_banner -y -i ' +
            AUDIO_FILE_NAME + INCOMING_AUDIO_EXTENSION +
            ' -ab ' + AUDIO_BIT_RATE +
            ' -ar ' + AUDIO_SAMPLE_RATE +
            ' -vn ' +
            PROCESSED_AUDIO_PREFIX + PROCESSED_AUDIO_EXTENSION)

        AudioFile.objects.filter(pk=audio_id).update(
            processed_audio=os.path.join(
                settings.AUDIO_PROCESSING_ROOT, audio_id, PROCESSED_AUDIO_PREFIX + PROCESSED_AUDIO_EXTENSION),
        )
    except FileNotFoundError:
        AudioFile.objects.filter(pk=audio_id).update(
            status='media_not_found'
        )
