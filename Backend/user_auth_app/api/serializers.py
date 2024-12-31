from rest_framework import serializers
from django.contrib.auth.models import User
from user_auth_app.models import UserProfile

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'password'] 

class UserProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=False)
    email = serializers.CharField(source='user.email', read_only=False)
    class Meta:
        model = UserProfile
        fields = ['user_id','username','email', 'phone', 'color']

    def update(self, instance, validated_data):
        # Extrahiere die verschachtelten Daten für den User
        user_data = validated_data.pop('user', {})
        username = user_data.get('username')
        email = user_data.get('email')

        # Aktualisiere den verknüpften User
        if username:
            instance.user.username = username
        if email:
            instance.user.email = email
        instance.user.save()  # Speichere die Änderungen am User

        # Aktualisiere die Felder des UserProfile
        instance.phone = validated_data.get('phone', instance.phone)
        instance.color = validated_data.get('color', instance.color)
        instance.save()  # Speichere die Änderungen am UserProfile

        return instance

class RegistrationSerializer(serializers.ModelSerializer):
    phone = serializers.IntegerField(required=False)  # Füge das Feld hinzu
    color = serializers.CharField(max_length=10, required=False)  # Füge das Feld hinzu
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone', 'color']
        extra_kwargs = {
            'password': {'write_only': True}  # Passwort wird nur zum Schreiben verwendet
        }

    def create(self, validated_data):
        # Extrahiere die zusätzlichen Felder
        phone = validated_data.pop('phone', None)
        color = validated_data.pop('color', None)

        # Benutzer erstellen
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            is_staff=True
        )
        user.set_password(validated_data['password'])
        user.save()

        # Profil erstellen
        UserProfile.objects.create(
            user=user,
            phone=phone,
            color=color,
        )

        return user