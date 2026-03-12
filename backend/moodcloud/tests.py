from dataclasses import Field
from datetime import timedelta
import random

from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient
from moodcloud.models import Field, MoodLogEntry, FieldValue
from datetime import date, timedelta

class RegisterViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/register/'

    def test_valid_registration_returns_201_and_tokens(self):
        """Test that valid registration returns 201 with tokens."""
        data = {
            'username': 'testuser',
            'password': 'testpass123',
            'password2': 'testpass123'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_duplicate_username_returns_400(self):
        """Test that duplicate username returns 400."""
        User.objects.create_user(username='testuser', password='testpass123')
        data = {
            'username': 'testuser',
            'password': 'testpass123',
            'password2': 'testpass123'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_password_returns_400(self):
        """Test that missing password returns 400."""
        data = {
            'username': 'testuser',
            'password2': 'testpass123'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class AnalysisViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.client.force_authenticate(user=self.user)

        self.number_field = Field.objects.create(user=self.user, name='Sleep (hours)', field_type='numeric')
        self.log_entry = MoodLogEntry.objects.create(user=self.user, logged_at=timezone.now())
        FieldValue.objects.create(log_entry=self.log_entry, field=self.number_field, numeric_value='5')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.number_field, numeric_value='9')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.number_field, numeric_value='3')

        self.text_field = Field.objects.create(user=self.user, name='Mood', field_type='text')
        self.log_entry = MoodLogEntry.objects.create(user=self.user, logged_at=timezone.now())
        FieldValue.objects.create(log_entry=self.log_entry, field=self.text_field, text_value='Happy')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.text_field, text_value='Sad')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.text_field, text_value='Neutral')

        self.boolean_field = Field.objects.create(user=self.user, name='Nosebleed', field_type='boolean')
        self.log_entry = MoodLogEntry.objects.create(user=self.user, logged_at=timezone.now())
        FieldValue.objects.create(log_entry=self.log_entry, field=self.boolean_field, boolean_value=True)
        FieldValue.objects.create(log_entry=self.log_entry, field=self.boolean_field, boolean_value=False)
        FieldValue.objects.create(log_entry=self.log_entry, field=self.boolean_field, boolean_value=True)


    def test_analysis_endpoint_returns_200(self):
        """Test that analysis endpoint returns 200."""
        today = date.today().isoformat()
        month_ago = (date.today() - timedelta(days=30)).isoformat()
        response = self.client.get(f'/api/analysis/?start_date={month_ago}&end_date={today}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_numeric_analysis(self):
        """Test that numeric analysis returns mean and median."""
        today = date.today().isoformat()
        month_ago = (date.today() - timedelta(days=30)).isoformat()
        response = self.client.get(f'/api/analysis/?start_date={month_ago}&end_date={today}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        analysis = response.data['analysis']
        numeric_result = next((a for a in analysis if a['field'] == 'Sleep (hours)'), None)
        self.assertIsNotNone(numeric_result)
        self.assertEqual(numeric_result['type'], 'numeric')
        self.assertAlmostEqual(numeric_result['mean'], 5.67, places=2)
        self.assertEqual(numeric_result['median'], 5)

    def test_boolean_analysis(self):
        """Test that boolean analysis returns true and false counts."""
        today = date.today().isoformat()
        month_ago = (date.today() - timedelta(days=30)).isoformat()
        response = self.client.get(f'/api/analysis/?start_date={month_ago}&end_date={today}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        analysis = response.data['analysis']
        boolean_result = next((a for a in analysis if a['field'] == 'Nosebleed'), None)
        self.assertIsNotNone(boolean_result)
        self.assertEqual(boolean_result['type'], 'boolean')
        self.assertEqual(boolean_result['true_count'], 2)
        self.assertEqual(boolean_result['false_count'], 1)

    def test_text_analysis(self):
        """Test that text analysis returns word counts."""
        today = date.today().isoformat()
        month_ago = (date.today() - timedelta(days=30)).isoformat()
        response = self.client.get(f'/api/analysis/?start_date={month_ago}&end_date={today}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        analysis = response.data['analysis']
        text_result = next((a for a in analysis if a['field'] == 'Mood'), None)
        self.assertIsNotNone(text_result)
        self.assertEqual(text_result['type'], 'text')
        word_counts = {wc['word']: wc['count'] for wc in text_result['word_counts']}
        self.assertEqual(word_counts.get('happy', 0), 1)
        self.assertEqual(word_counts.get('sad', 0), 1)
        self.assertEqual(word_counts.get('neutral', 0), 1)

class DashboardViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.client.force_authenticate(user=self.user)

        self.number_field = Field.objects.create(user=self.user, name='Sleep (hours)', field_type='numeric')
        self.text_field = Field.objects.create(user=self.user, name='Mood', field_type='text')
        self.boolean_field = Field.objects.create(user=self.user, name='Nosebleed', field_type='boolean')

        self.log_entry = MoodLogEntry.objects.create(user=self.user, logged_at=timezone.now() - timedelta(days=6))
        FieldValue.objects.create(log_entry=self.log_entry, field=self.number_field, numeric_value='8')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.text_field, text_value='Okay')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.boolean_field, boolean_value=True)

        self.log_entry = MoodLogEntry.objects.create(user=self.user, logged_at=timezone.now() - timedelta(days=5))
        FieldValue.objects.create(log_entry=self.log_entry, field=self.number_field, numeric_value='7')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.text_field, text_value='Farty')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.boolean_field, boolean_value=False)

        self.log_entry = MoodLogEntry.objects.create(user=self.user, logged_at=timezone.now() - timedelta(days=4))
        FieldValue.objects.create(log_entry=self.log_entry, field=self.number_field, numeric_value='7')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.text_field, text_value='Good')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.boolean_field, boolean_value=False)

        self.log_entry = MoodLogEntry.objects.create(user=self.user, logged_at=timezone.now() - timedelta(days=3))
        FieldValue.objects.create(log_entry=self.log_entry, field=self.number_field, numeric_value='5')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.text_field, text_value='Sad')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.boolean_field, boolean_value=False)

        self.log_entry = MoodLogEntry.objects.create(user=self.user, logged_at=timezone.now() - timedelta(days=2))
        FieldValue.objects.create(log_entry=self.log_entry, field=self.text_field, text_value='Happy')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.number_field, numeric_value='9')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.boolean_field, boolean_value=True)

        self.log_entry = MoodLogEntry.objects.create(user=self.user, logged_at=timezone.now() - timedelta(days=1))
        FieldValue.objects.create(log_entry=self.log_entry, field=self.boolean_field, boolean_value=True)
        FieldValue.objects.create(log_entry=self.log_entry, field=self.number_field, numeric_value='3')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.text_field, text_value='Neutral')

        self.log_entry = MoodLogEntry.objects.create(user=self.user, logged_at=timezone.now())
        FieldValue.objects.create(log_entry=self.log_entry, field=self.number_field, numeric_value='4')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.text_field, text_value='Happy')
        FieldValue.objects.create(log_entry=self.log_entry, field=self.boolean_field, boolean_value=False)

    def test_dashboard_endpoint_returns_200(self):
        """Test that dashboard endpoint returns 200."""
        response = self.client.get('/api/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_dashboard_streak_calculation(self):
        """Test that dashboard calculates streak correctly."""
        response = self.client.get('/api/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data['streak'], 7)
        self.assertTrue(data['has_entries_last_7_days'])
        self.assertTrue(data['has_entries_last_30_days'])

class CreateLogEntryViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.client.force_authenticate(user=self.user)
        self.field = Field.objects.create(user=self.user, name='Mood', field_type='text')

    def test_create_log_entry_returns_201(self):
        """Test that creating a log entry returns 201."""
        response = self.client.post('/api/create_log_entry/', data={
            'field_values': [
                {'field_id': self.field.id, 'text_value': 'Happy'}
            ]
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(MoodLogEntry.objects.filter(user=self.user).exists())

    def test_create_log_entry_saves_field_values(self):
        self.client.post('/api/create_log_entry/', data={
            'field_values': [
                {'field_id': self.field.id, 'text_value': 'Happy'}
            ]
        }, format='json')
        entry = MoodLogEntry.objects.get(user=self.user)
        self.assertEqual(entry.field_values.count(), 1)
        self.assertEqual(entry.field_values.first().text_value, 'Happy')

class MeViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.client.force_authenticate(user=self.user)

    def test_me_endpoint_returns_200_and_user_info(self):
        """Test that /api/me/ returns 200 and user info."""
        response = self.client.get('/api/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_update_username(self):
        response = self.client.patch('/api/me/', {'username': 'newname'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'newname')

    def test_delete_account(self):
        response = self.client.delete('/api/me/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(username='testuser').exists())

class ChangePasswordViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.client.force_authenticate(user=self.user)

    def test_change_password_success(self):
        response = self.client.post('/api/change-password/', {
            'old_password': 'testpass123',
            'new_password': 'newpass456',
            'new_password_confirm': 'newpass456'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass456'))

    def test_change_password_wrong_old_password(self):
        response = self.client.post('/api/change-password/', {
            'old_password': 'wrongpass',
            'new_password': 'newpass456',
            'new_password_confirm': 'newpass456'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password_mismatched_new_passwords(self):
        response = self.client.post('/api/change-password/', {
            'old_password': 'testpass123',
            'new_password': 'newpass456',
            'new_password_confirm': 'differentpass'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)