from django.db import models

# nach Änderungen ausführen (in der env!!):
# py manage.py makemigrations
# py manage.py migrate 

# Create your models here.
class contact(models.Model):
    Name = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    phone = models.CharField(max_length=20)
    color = models.CharField(max_length=10)

    def __str__(self):
        return self.Name

class task(models.Model):
    # muss noch angepasst / überarbeitet werden
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=50)
    contacts = models.ManyToManyField(contact)
    date = models.DateField(max_length=50)#evtl. CharField
    priority = models.IntegerField()
    category = models.CharField(max_length=50)
    subtasks = models.JSONField()
    subtasksProgress = models.IntegerField()
    colum = models.CharField(max_length=50)

class subtask(models.Model): # evtl. wieder löschen
    name = models.CharField(max_length=50)
    done = models.BooleanField(default=False)