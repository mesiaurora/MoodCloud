from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import random
from moodcloud.models import Field, MoodLogEntry, FieldValue

class Command(BaseCommand):
    help = 'Creates demo user and 30 days of sample data'

    def handle(self, *args, **kwargs):
        # Clean up existing demo user
        User.objects.filter(username='demo').delete()

        # Create demo user
        user = User.objects.create_user(username='demo', password='demo1234')
        self.stdout.write('Created user: demo / demo1234')

        # Create fields
        fields = [
            Field.objects.create(user=user, name='Mood', field_type='text'),
            Field.objects.create(user=user, name='Sleep (hours)', field_type='numeric'),
            Field.objects.create(user=user, name='Sleep quality', field_type='text'),
            Field.objects.create(user=user, name='Nosebleed', field_type='boolean'),
        ]

        # Create 30 days of entries
        for i in range(30):
            entry = MoodLogEntry.objects.create(user=user)
            entry.logged_at = timezone.now() - timedelta(days=i)
            entry.save()

            FieldValue.objects.create(log_entry=entry, field=fields[0],
                text_value=random.choice(['happy', 'calm', 'tired', 'anxious', 'great', 'good', 'okay', 'stressed']))
            FieldValue.objects.create(log_entry=entry, field=fields[1],
                numeric_value=random.randint(4, 10))
            FieldValue.objects.create(log_entry=entry, field=fields[2],
                text_value=random.choice(['great', 'good', 'okay', 'bad', 'restless', 'deep']))
            FieldValue.objects.create(log_entry=entry, field=fields[3],
                boolean_value=random.choice([True, False]))

        self.stdout.write(self.style.SUCCESS('Demo data created successfully'))