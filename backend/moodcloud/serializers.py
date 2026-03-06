from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Field, FieldValue, MoodLogEntry

class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = ['id', 'name', 'field_type', 'created_at', 'is_active']

class FieldValueSerializer(serializers.ModelSerializer):
    field = FieldSerializer(read_only=True)
    field_id = serializers.PrimaryKeyRelatedField(queryset=Field.objects.all(), source='field', write_only=True)

    class Meta:
        model = FieldValue
        fields = ['id', 'field', 'field_id', 'numeric_value', 'text_value', 'boolean_value']



class MoodLogEntrySerializer(serializers.ModelSerializer):
    field_values = FieldValueSerializer(many=True, read_only=True)

    class Meta:
        model = MoodLogEntry
        fields = ['id', 'logged_at', 'field_values']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'password']

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user