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

# class RegistrationSerializer(serializers.ModelSerializer):
    
#     class Meta:
#         model = User
#         fields = ['username', 'email', 'password', 'repeated_password']


#     def save(self):
#         pw = self.validated_data['password']
#         repeated_pw = self.validated_data['repeated_password']

#         if pw != repeated_pw:
#             raise serializers.ValidationError(['error' : 'passwords dont match'])

#         if User.objects.filter(email=self.validated_data['email']).exists():
#             raise serializers.ValidationError({'error:':'Email already exists!'})

#         account  = User(email=self.validated_data['email'], ussername=self.validated_data['username'])
#         account.set_password(pw)
#         account.save()
#         return  account