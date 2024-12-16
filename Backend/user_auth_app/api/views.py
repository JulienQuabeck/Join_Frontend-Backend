from rest_framework import generics, viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
#from .serializers import UserProfileSerializer, RegistrationSerializer
from .serializers import UserProfileSerializer
from user_auth_app.models import UserProfile
from django.contrib.auth.models import User
from rest_framework.response import Response



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
    
# class RegistrationView(APIView):
#     permission_class = [AllowAny]

#     def post(self, request):
#         serializer = RegistrationSerializer(data=request.data)

#         data = {}
#         if serializer.is_valid():
#             saved_account = serializer.save()
#             token, created = Token.objects.get_or_create(user = saved_account)
#             data = {
#                 'token' : token.key,
#                 'username' : saved_account.username,
#                 'email' : saved_account.email
#             }
#         else:
#             data=serializer.errors

#         return Response(data)