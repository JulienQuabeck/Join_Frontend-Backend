from django.shortcuts import render
from .models import contact, task
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from .serializer import ContactSerializer, TaskSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .permissions import IsStaffOrReadOnly

from rest_framework.response import Response
from rest_framework import status


# Create your views here.

class contactModelViewSet(viewsets.ModelViewSet):
    queryset = contact.objects.all()
    serializer_class = ContactSerializer

class taskModelViewSet(viewsets.ModelViewSet):
    queryset = task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsStaffOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Zeigt die genauen Fehler
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)