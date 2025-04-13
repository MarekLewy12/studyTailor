from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, ModelRequest, Subject, Material, StudySession, Profile

from .models import ModelRequest
admin.site.register(ModelRequest)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'album_number', 'is_active', 'is_staff', 'is_superuser')

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password', 'password2', 'album_number', 'is_staff', 'is_superuser'),
        }),
    )

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'album_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'lesson_form', 'start_datetime', 'end_datetime', 'is_mastered', 'user')
    list_filter = ('user', 'lesson_form', 'is_mastered')
    search_fields = ('name', 'user__username')
    ordering = ('start_datetime',)


admin.site.register(Material)
admin.site.register(StudySession)
admin.site.register(Profile)

