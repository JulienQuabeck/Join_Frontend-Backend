# Generated by Django 5.1.3 on 2024-11-29 05:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Join', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='token',
        ),
        migrations.AlterField(
            model_name='task',
            name='contacts',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Join.contact'),
        ),
        migrations.AlterField(
            model_name='task',
            name='date',
            field=models.DateField(max_length=50),
        ),
        migrations.AlterField(
            model_name='task',
            name='subtasks',
            field=models.JSONField(),
        ),
    ]
