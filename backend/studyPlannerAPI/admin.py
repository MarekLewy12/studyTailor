from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

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

