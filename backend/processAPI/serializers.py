from rest_framework import serializers

from processAPI.models import AudioFile


class AudioFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioFile
        fields = ['id', 'modified_at', 'created_at',
                  'name', 'audio', 'processed_audio']
        read_only_fields = ['id', 'created_at',
                            'modified_at', 'processed_audio']
