from rest_framework import generics, viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.viewsets import ViewSet
from .serializers import UserProfileSerializer, RegistrationSerializer
#from .serializers import UserProfileSerializer
from user_auth_app.models import UserProfile
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.auth import authenticate



class UserProfileList(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def create(self, request, *args, **kwargs):
        user_data = request.data.get('user')
        if not user_data:
            return Response({'error': 'User data is required.'}, status=status.HTTP_400_BAD_REQUEST)

        phone = request.data.get('phone')
        color = request.data.get('color')

        # Benutzer erstellen
        user = User.objects.create(
            username=user_data['username'],
            email=user_data.get('email', ''),
        )
        user.set_password(user_data['password'])
        user.save()

        # UserProfile mit derselben ID wie User erstellen
        user_profile = UserProfile.objects.create(
            user=user,
            phone=phone,
            color=color,
        )

        # Serialisieren und zurückgeben
        serializer = self.get_serializer(user_profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RegistrationView(ViewSet):
    
    def create(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'message': 'User created successfully!',
                'token': token.key  # Gebe den Token zurück
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CustomLoginView(ObtainAuthToken):
    permission_classes = [AllowAny]
    
    # def post(self, request):
    #     serializer = self.serializer_class(data=request.data)
    #     data = {}
    #     if serializer.is_valid():
    #         user = serializer.validated_data['user']
    #         token, created = Token.objects.get_or_create(user=user)
    #         data = {
    #             'token': token.key,
    #             'id': user.id,
    #             'username': user.username,
    #             'email': user.email
    #         }
    #     else:
    #         data = serializer.errors

    #     return Response(data)
    def post(self, request):
        # Hole die Email und das Passwort aus der Anfrage
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            # Suche den Benutzer anhand der E-Mail
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Authentifiziere den Benutzer mit dem gefundenen username und Passwort
        user = authenticate(username=user.username, password=password)
        if user:
            # Token generieren oder holen
            token, created = Token.objects.get_or_create(user=user)
            data = {
                'token': token.key,
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )