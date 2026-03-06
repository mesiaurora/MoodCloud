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

        streak = 0
        current_date = timezone.now().date()
        for entry in moodlogentries:
            entry_date = entry.logged_at.date()
            if entry_date == current_date:
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
        # Placeholder for dashboard data aggregation logic
        data = self.fetch_data_for_user(request.user)
        return Response(data)
    

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