from django.contrib import admin
from django.contrib.auth.models import Group, User

from processAPI.models import AudioFile


class UserAdmin(admin.ModelAdmin):
    fields = ('username', 'email', 'is_active',
              'is_superuser',  'last_login', 'date_joined',)
    readonly_fields = ('username', 'email', 'is_superuser',
                       'last_login', 'date_joined', )
    list_display = ('username', 'email', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff')
    search_fields = ['username', 'email']


class AudioFileAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at', 'modified_at',)
    search_fields = ('id', 'name',)
    fields = ('id', 'modified_at', 'created_at',
              'name', 'audio', 'processed_audio', 'denoised_audio', 'vocals_audio', 'music_audio')
    readonly_fields = ('id', 'created_at', 'modified_at', 'processed_audio',
                       'denoised_audio', 'vocals_audio', 'music_audio')


# Register your models here.
admin.site.site_header = 'AudMIX Backend Admin Dashboard'
admin.site.unregister(Group)
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(AudioFile, AudioFileAdmin)
