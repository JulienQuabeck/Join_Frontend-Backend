from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    phone = models.IntegerField(blank=True, null=True)
    color = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return self.user.username
    