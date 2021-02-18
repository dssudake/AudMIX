from rest_framework import serializers
from .models import upload

class uploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = upload
        fields =['Name','File']