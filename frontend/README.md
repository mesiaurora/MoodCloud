# MoodCloud Frontend

A React + TypeScript + Vite frontend application for tracking and analyzing daily moods and emotional patterns.

## Features

- **Authentication**: User login and registration system with protected routes
- **Dashboard**: Overview of mood trends and key insights
- **Logging**: Easy mood entry with analysis
- **History**: View past mood entries
- **Analytics**: Detailed analysis and visualization of mood patterns
- **Settings**: User preferences and account management

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **ESLint** - Code quality and linting

## Project Structure

```
src/
├── api/              # API client modules
│   ├── analysis.ts
│   ├── auth.ts
│   ├── client.ts
│   ├── dashboard.ts
│   ├── fields.ts
│   └── logentry.ts
├── components/       # Reusable React components
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── context/          # React Context for state management
│   └── AuthContext.tsx
├── pages/            # Page components
│   ├── Analysis.tsx
│   ├── Dashboard.tsx
│   ├── History.tsx
│   ├── Log.tsx
│   ├── LogEntry.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Settings.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Getting Started

### Prerequisites
- Node.js (18+)  
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Environment Variables

Create a `.env` file in the root directory with:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## License

This project is part of the MoodCloud application.
