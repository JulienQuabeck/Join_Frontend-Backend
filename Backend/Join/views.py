from django.shortcuts import render
from .models import contact, task
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from .serializer import ContactSerializer, TaskSerializer


# Create your views here.

class contactModelViewSet(viewsets.ModelViewSet):
    queryset = contact.objects.all()
    serializer_class = ContactSerializer

class taskModelViewSet(viewsets.ModelViewSet):
    queryset = task.objects.all()
    serializer_class = TaskSerializer
