from django.contrib import admin
from django.contrib.auth.models import Group, User

from processAPI.models import AudioFile


class AudioFileAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at', 'modified_at',)
    search_fields = ('id', 'name',)
    fields = ('id', 'modified_at', 'created_at',
              'name', 'audio', 'processed_audio')
    readonly_fields = ('id', 'created_at', 'modified_at', 'processed_audio',)


# Register your models here.
admin.site.site_header = 'AudMIX Backend Admin Dashboard'
admin.site.unregister(Group)
admin.site.unregister(User)
admin.site.register(AudioFile, AudioFileAdmin)
