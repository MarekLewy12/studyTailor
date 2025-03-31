from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, ModelRequest, Subject, Material, StudySession

from .models import ModelRequest
admin.site.register(ModelRequest)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'password', 'album_number', 'is_staff', 'is_superuser')

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password', 'album_number', 'is_staff', 'is_superuser'),
        }),
    )

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Dane osobowe', {'fields': ('album_number',)}),
        ('Uprawnienia', {'fields': ('is_staff', 'is_superuser', 'is_active')}),
    )

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'lesson_form', 'start_datetime', 'end_datetime', 'is_mastered', 'user')
    list_filter = ('user', 'lesson_form', 'is_mastered')
    search_fields = ('name', 'user__username')
    ordering = ('start_datetime',)


admin.site.register(Material)
admin.site.register(StudySession)

