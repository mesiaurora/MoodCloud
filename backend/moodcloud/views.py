import statistics
from unittest import result

from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Field, MoodLogEntry, FieldValue
from .serializers import FieldSerializer, MoodLogEntrySerializer, FieldValueSerializer, UserSerializer
from django.utils import timezone
from datetime import timedelta

# ViewSets for CRUD operations on models
class FieldViewSet(viewsets.ModelViewSet):
    serializer_class = FieldSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Field.objects.filter(user=self.request.user)
    
class MoodLogEntryViewSet(viewsets.ModelViewSet):
    serializer_class = MoodLogEntrySerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return MoodLogEntry.objects.filter(user=self.request.user)

class FieldValueViewSet(viewsets.ModelViewSet):
    serializer_class = FieldValueSerializer

    def get_queryset(self):
        return FieldValue.objects.filter(log_entry__user=self.request.user)
    

# APIViews for user registration and authentication
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def fetch_data_for_user(self, user):
        moodlogentries = MoodLogEntry.objects.filter(user=user, logged_at__gte=timezone.now() - timedelta(days=30)).order_by('-logged_at')
        
        logged_dates = sorted(set(
            entry.logged_at.date() for entry in moodlogentries
        ), reverse=True)

        #calculate streak of consecutive days with entries
        streak = 0
        current_date = timezone.now().date()

        # If user hasn't logged today yet, check yesterday and calculate streak from yesterday
        if current_date not in logged_dates:
            current_date = current_date - timedelta(days=1)

        for date in logged_dates:
            if date == current_date:
                streak += 1
                current_date -= timedelta(days=1)
            else:
                break
        
        has_entries_last_7_days = moodlogentries.filter(logged_at__gte=timezone.now() - timedelta(days=7)).exists()
        has_entries_last_30_days = moodlogentries.exists()
        
        return {
            'streak': streak,
            'has_entries_last_7_days': has_entries_last_7_days,
            'has_entries_last_30_days': has_entries_last_30_days,
        }

    def get(self, request):
        data = self.fetch_data_for_user(request.user)
        return Response(data)

class AnalysisView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def calculate_analysis(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        moodlogentries = MoodLogEntry.objects.filter(user=request.user, logged_at__date__gte=start_date, logged_at__date__lte=end_date)
        fields = Field.objects.filter(user=request.user, is_active=True)
        
        results = []
        for field in fields:
            field_values = FieldValue.objects.filter(log_entry__in=moodlogentries, field=field)
            if field.field_type == 'numeric':
                values = [fv.numeric_value for fv in field_values if fv.numeric_value is not None]
                if not values:
                    continue
            
                mean = statistics.mean(values)
                median = statistics.median(values)
                results.append({'field': field.name, 'type': 'numeric', 'mean': mean, 'median': median})
            elif field.field_type == 'boolean':
                true_count = field_values.filter(boolean_value=True).count()
                false_count = field_values.filter(boolean_value=False).count()
                results.append({'field': field.name, 'type': 'boolean', 'true_count': true_count, 'false_count': false_count})
            elif field.field_type == 'text':
                word_counts = {}
                for fv in field_values:
                    for word in fv.text_value.lower().split():
                        word_counts[word] = word_counts.get(word, 0) + 1
                results.append({'field': field.name, 'type': 'text', 'word_counts': [{'word': w, 'count': c} for w, c in word_counts.items()]})

        return results

    def get(self, request):
        result = self.calculate_analysis(request)
        return Response({
            "analysis": result
        })   

class CreateLogEntryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        entry = MoodLogEntry.objects.create(user=request.user)
        field_values = request.data.get('field_values', [])
        for fv in field_values:
            FieldValue.objects.create(
                log_entry=entry,
                field_id=fv['field_id'],
                numeric_value=fv.get('numeric_value'),
                boolean_value=fv.get('boolean_value'),
                text_value=fv.get('text_value'),
            )
        return Response(MoodLogEntrySerializer(entry).data, status=status.HTTP_201_CREATED)
    
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'})