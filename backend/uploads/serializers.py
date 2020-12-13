from rest_framework import serializers
from .models import upload

class mediaserializer(serializers.ModelSerializer):
    class Meta:
        model=upload
        fields=("id","name","audio")