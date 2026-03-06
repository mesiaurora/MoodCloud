from django.db import models

class Field(models.Model):
    FIELD_TYPE_CHOICES = [
    ('numeric', 'Numeric'),
    ('boolean', 'Boolean'),
    ('text', 'Text'),
]
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    field_type = models.CharField(max_length=50, choices=FIELD_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user}: {self.name} ({self.field_type})"
    


class MoodLogEntry(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    logged_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"LogEntry {self.id} by {self.user}"
    

class FieldValue(models.Model):
    id = models.AutoField(primary_key=True)
    log_entry = models.ForeignKey(MoodLogEntry, on_delete=models.CASCADE, related_name='field_values')
    field = models.ForeignKey(Field, on_delete=models.CASCADE)
    numeric_value = models.FloatField(null=True, blank=True)
    text_value = models.CharField(max_length=255, null=True, blank=True)
    boolean_value = models.BooleanField(null=True, blank=True)

    def __str__(self):
        return f"Value for {self.field.name} in LogEntry {self.log_entry.id}"