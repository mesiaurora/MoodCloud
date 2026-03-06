from rest_framework.routers import DefaultRouter
from .views import FieldViewSet, MoodLogEntryViewSet, FieldValueViewSet

router = DefaultRouter()
router.register(r'fields', FieldViewSet, basename='field')
router.register(r'mood-log-entries', MoodLogEntryViewSet, basename='moodlogentry')
router.register(r'field-values', FieldValueViewSet, basename='fieldvalue')

urlpatterns = router.urls