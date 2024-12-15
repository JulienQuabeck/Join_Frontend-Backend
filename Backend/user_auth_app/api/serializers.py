from rest_framework import serializers
from django.contrib.auth.models import User
from user_auth_app.models import UserProfile

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'password'] 

class UserProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    # user = UserSerializer()
    class Meta:
        model = UserProfile
        fields = ['user_id','username','email', 'phone', 'color']