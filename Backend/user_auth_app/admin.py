from django.contrib import admin
from .models import UserProfile

# Register your models here.
# class UserProfileAdmin(admin.ModelAdmin):
#     list_display = ('user', 'phone', 'color')  # Hier kannst du die Felder angeben, die du im Admin anzeigen möchtest
#     search_fields = ('user__username', 'user__email', 'phone', 'color')  # Suchfelder im Admin
#     ordering = ('user',)  # Sortieren nach Benutzername

# admin.site.register(UserProfile, UserProfileAdmin)