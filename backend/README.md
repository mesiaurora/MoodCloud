# Moodcloud Backend

A Django REST Framework-based backend for the Moodcloud mood tracking application. This API allows users to log mood entries, create custom fields, and track mood patterns over time.

## Project Structure

```
backend/
├── manage.py                 # Django management script
├── db.sqlite3               # SQLite database
├── backend/                 # Project configuration
│   ├── settings.py         # Django settings
│   ├── urls.py             # URL routing
│   ├── wsgi.py             # WSGI configuration
│   └── asgi.py             # ASGI configuration
└── moodcloud/              # Main application
    ├── models.py           # Database models
    ├── views.py            # API views and viewsets
    ├── serializers.py      # DRF serializers
    ├── urls.py             # App URL routing
    ├── admin.py            # Django admin configuration
    ├── apps.py             # App configuration
    ├── tests.py            # Test suite
    └── migrations/         # Database migrations
```

## Features

- **User Authentication**: JWT-based authentication using Django REST Framework Simple JWT
- **Mood Logging**: Create and track mood log entries with custom fields
- **Custom Fields**: Define custom fields (numeric, boolean, text) for mood tracking
- **Field Values**: Store values for custom fields in mood log entries
- **Dashboard**: Aggregate mood data including streak tracking and entry frequency
- **CORS Support**: Configured for frontend integration at `http://localhost:5173`

## Models

### Field
Represents a custom field that a user can add to their mood logs.
- `name`: Field name
- `field_type`: Type of field (numeric, boolean, text)
- `user`: Foreign key to User
- `created_at`: Creation timestamp
- `is_active`: Whether the field is active

### MoodLogEntry
Represents a mood log entry created by a user.
- `user`: Foreign key to User
- `logged_at`: Entry timestamp

### FieldValue
Stores values for custom fields in mood log entries.
- `field`: Foreign key to Field
- `log_entry`: Foreign key to MoodLogEntry
- `numeric_value`: For numeric fields
- `text_value`: For text fields
- `boolean_value`: For boolean fields

## API Endpoints

### Authentication
- `POST /api/token/` - Obtain JWT tokens
- `POST /api/token/refresh/` - Refresh access token
- `POST /api/register/` - Register new user
- `GET /api/me/` - Get current user info

### CRUD Operations
- `GET/POST /api/fields/` - List/create fields
- `GET/POST /api/mood-log-entries/` - List/create mood log entries
- `GET/POST /api/field-values/` - List/create field values

### Dashboard
- `GET /api/dashboard/` - Get aggregated mood data (streak, entry frequency)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/`

## Configuration

### CORS Settings
Frontend origin is configured in `backend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### Authentication
Uses JWT authentication. Include the token in request headers:
```
Authorization: Bearer <your_access_token>
```

### Database
SQLite database (`db.sqlite3`) is used for development. See `backend/settings.py` for database configuration.

## Testing

Run the test suite:
```bash
python manage.py test
```

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/` with your superuser credentials.

## Technologies

- **Django 6.0.3**: Web framework
- **Django REST Framework**: REST API framework
- **Django REST Framework Simple JWT**: JWT authentication
- **Django CORS Headers**: CORS support
- **SQLite**: Database

## Development Notes

- All viewsets require authentication except for user registration
- Users can only see their own data (fields, mood entries, field values)
- The dashboard view aggregates user-specific mood data with a 30-day window
- Custom fields support three types: numeric, boolean, and text values