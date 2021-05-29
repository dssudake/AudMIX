import os
import time

from celery import shared_task
from celery_progress.backend import ProgressRecorder
from django.conf import settings

from processAPI.models import AudioFile
from processAPI.helper import dl_noise_reduce

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
        AudioFile.objects.filter(pk=audio_id).update()


@shared_task(bind=True)
def denoise_audio(self, audio_id):
    """
    Process audio through deep learning to reduce noise
    """
    try:
        progress_recorder = ProgressRecorder(self)

        audio_file = AudioFile.objects.get(pk=audio_id)
        audio_file_path = audio_file.processed_audio.path

        audio_id = str(audio_id)
        folder_path = os.path.join(
            settings.MEDIA_ROOT, settings.AUDIO_PROCESSING_ROOT, audio_id)
        os.chdir(folder_path)
        progress_recorder.set_progress(5, 100)

        op_file_path = dl_noise_reduce(
            audio_id, folder_path, audio_file_path, progress_recorder)
        progress_recorder.set_progress(95, 100)

        audio_file.processed_audio = op_file_path
        audio_file.save()
        progress_recorder.set_progress(100, 100)

        return 'AUDIO_DENOISED'
    except FileNotFoundError:
        AudioFile.objects.filter(pk=audio_id).update()


@shared_task(bind=True)
def seperate_audio(self, audio_id):
    try:
        progress_recorder = ProgressRecorder(self)
        progress_recorder.set_progress(5, 100)

        audio_file = AudioFile.objects.get(pk=audio_id)
        audio_file_path = audio_file.audio.path
        folder_path = os.path.join(
            settings.MEDIA_ROOT, settings.AUDIO_PROCESSING_ROOT, audio_id)
        os.chdir(folder_path)
        output_folder = os.path.join(folder_path, 'seperated_output')
        progress_recorder.set_progress(15, 100)

        # Change directory for Spleeter and run Command to seperate audio
        os.chdir(settings.BASE_DIR)
        os.system('spleeter separate -p spleeter:2stems -c mp3 -b 512k -o ' +
                  output_folder+' '+audio_file_path)
        progress_recorder.set_progress(75, 100)

        vocal_path = os.path.join(
            settings.AUDIO_PROCESSING_ROOT, audio_id, 'seperated_output', 'audio', 'vocals.mp3')
        music_path = os.path.join(settings.AUDIO_PROCESSING_ROOT,
                                  audio_id, 'seperated_output', 'audio', 'accompaniment.mp3')

        audio_file.vocals_audio = vocal_path
        audio_file.music_audio = music_path
        progress_recorder.set_progress(90, 100)
        audio_file.save()
        progress_recorder.set_progress(100, 100)
        return 'AUDIO_SEPARATED'
    except FileNotFoundError:
        AudioFile.objects.filter(pk=audio_id).update()
