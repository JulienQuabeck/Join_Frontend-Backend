# Generated by Django 5.1.3 on 2024-11-29 05:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Join', '0002_remove_task_token_alter_task_contacts_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='subtasksProgress',
            field=models.IntegerField(),
        ),
    ]
