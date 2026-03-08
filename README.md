# MoodCloud

MoodCloud is a personal mood and wellness tracker that lets you define your own tracking fields and analyse the data over time.
Stack: Django + Django REST Framework + React + TypeScript + Tailwind CSS.

---

## Prerequisites

- Python 3.12+
- Node.js v24+
- pip
- npm

---

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```
SECRET_KEY=your-secret-key-here
```

Run migrations and start the server:
```bash
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:8000`.

---

## Demo data

To create a demo user with 30 days of sample data:
```bash
cd backend
source venv/bin/activate
python manage.py create_demo_data
```

This creates a user with credentials:
- **Username:** demo
- **Password:** demo1234

---

## Features

- Define custom tracking fields (numeric, boolean, text)
- Log daily entries
- View history and delete entries
- Analyse data by week, month, or custom date range
- Word cloud for text fields, split bar for boolean fields, median/mean for numeric fields
- Streak tracking

---

## Notes

- Database is SQLite, included in `.gitignore` — run migrations and demo data command on first setup
- JWT authentication with automatic token refresh
