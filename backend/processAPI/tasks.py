import os
import uuid
import glob
import numpy as np
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

        audio_file.denoised_audio = op_file_path
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


@shared_task(bind=True)
def crop_and_merge(self, pk, name, segments):
    try:
        progress_recorder = ProgressRecorder(self)
        progress_recorder.set_progress(5, 100)
        id = uuid.uuid4()
        segments = segments.split(',')
        segments = [float(i) for i in segments]
        segments = np.reshape(segments, (3, 2))
        audio_file = AudioFile.objects.get(pk=pk)
        audio_file_path = audio_file.audio.path
        output_folder_name = 'Original_Audio'
        if(name == 'Denoised Audio'):
            audio_file_path = audio_file.denoised_audio.path
            output_folder_name = 'Denoised_Audio'
        elif(name == 'Vocals Only'):
            audio_file_path = audio_file.vocals_audio.path
            output_folder_name = 'Vocals_Only'
        elif(name == 'Music only'):
            audio_file_path = audio_file.music_audio.path
            output_folder_name = 'Music_Only'
        progress_recorder.set_progress(25, 100)
        # audio_file_path = audio_file.audio.path
        folder_path = os.path.join(
            settings.MEDIA_ROOT, settings.AUDIO_PROCESSING_ROOT, pk)
        os.chdir(folder_path)
        output_folder = os.path.join(
            folder_path, 'Cropped_Files', output_folder_name)
        progress_recorder.set_progress(55, 100)
        # Create folder if not exist
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)

        # Delete Previous Files
        delete = os.path.join(output_folder, '*.mp3')
        print('delete : ', delete)
        files = glob.glob(delete)
        for f in files:
            os.remove(f)
        progress_recorder.set_progress(65, 100)
        # Crop and add new segment files
        n = 0
        locations = []
        print(n)
        print(locations)
        for i in range(0, 3):
            start = segments[i][0]
            end = segments[i][1]
            file_name = output_folder_name+'_Segment'+str(i+1)+'.mp3'
            output = os.path.join(output_folder, file_name)
            if(start != 0.0 and end != 0.0):
                n = n+1
                os.system(
                    'ffmpeg -y -i '+audio_file_path
                    + ' -ss '+str(start) + ' -to '+str(end)+' '+output
                )
                locations.append(output)
        # Merge the Cropped Segments
        # make output folder
        progress_recorder.set_progress(85, 100)
        merged_folder = os.path.join(output_folder, 'output')
        if not os.path.exists(merged_folder):
            os.makedirs(merged_folder)
        merged_file_name = output_folder_name + \
            '_Merged_Segments'+str(id.hex)+'.mp3'
        output = os.path.join(merged_folder, merged_file_name)

        text_file_path = os.path.join(output_folder, 'input.txt')
        txt = open(text_file_path, 'w')
        txt.write("# this is a comment")
        if(n == 1):
            txt.write("\nfile '"+str(locations[0])+"'")
        elif(n == 2):
            txt.write(
                "\nfile '"+str(locations[0])+"'"+"\nfile '"+str(locations[1])+"'")
        elif(n == 3):
            txt.write("\nfile '"+str(locations[0])+"'"+"\nfile '"+str(
                locations[1])+"'"+"\nfile '"+str(locations[2])+"'")
        txt.close()

        os.system('ffmpeg -y -f concat -safe 0 -i ' +
                  text_file_path+' -c copy '+output)

        # Overwrite Merged Audio
        if(name == 'Original Audio'):
            audio_file.audio = os.path.join(
                settings.AUDIO_PROCESSING_ROOT, pk, 'Cropped_Files', output_folder_name, 'output', merged_file_name)
        elif(name == 'Denoised Audio'):
            audio_file.denoised_audio = os.path.join(
                settings.AUDIO_PROCESSING_ROOT, pk, 'Cropped_Files', output_folder_name, 'output', merged_file_name)
        elif(name == 'Vocals Only'):
            audio_file.vocals_audio = os.path.join(
                settings.AUDIO_PROCESSING_ROOT, pk, 'Cropped_Files', output_folder_name, 'output', merged_file_name)
        elif(name == 'Music only'):
            audio_file.music_audio = os.path.join(
                settings.AUDIO_PROCESSING_ROOT, pk, 'Cropped_Files', output_folder_name, 'output', merged_file_name)

        if(audio_file_path.count('audio.mp3') > 0 or audio_file_path.count('audio_processed_denoised.wav') > 0 or audio_file_path.count('vocals.mp3') > 0 or audio_file_path.count('accompaniment.mp3') > 0):
            print("Not Removed")
        else:
            os.remove(audio_file_path)
        audio_file.save()
        progress_recorder.set_progress(100, 100)
        return 'AUDIO_CROPPED_AND_MERGED'

    except FileNotFoundError:
        AudioFile.objects.filter(pk=pk).update()
