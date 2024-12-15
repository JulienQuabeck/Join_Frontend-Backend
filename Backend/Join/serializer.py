from rest_framework import serializers
from .models import contact, task

class ContactSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = contact
        exclude = []

class TaskSerializer(serializers.ModelSerializer):

    contact_name = serializers.CharField(source='contacts.Name', read_only=True)

    class Meta:
        model = task
        exclude = []