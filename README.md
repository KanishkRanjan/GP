# 75% Attendance Tracker

A full-stack web application that helps college students track and control their attendance.

## Features

- **Authentication**: Sign up/Login with Firebase Auth
- **Dashboard**: Track attendance for all subjects with real-time calculations
- **Bunk Predictor**: Simulate future attendance before making decisions
- **Leaderboard**: Compare attendance with peers
- **Alerts**: Email notifications when attendance drops below 75%
- **Visual Charts**: Progress bars and pie charts for attendance tracking

## Tech Stack

**Frontend:**
- React.js
- React Router
- Recharts
- Firebase SDK

**Backend:**
- Node.js
- Firebase Cloud Functions
- Firebase Firestore
- Firebase Auth
- Nodemailer

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Firebase CLI
- Gmail account (for email notifications)

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update Firebase config in `src/firebase.js` with your Firebase project credentials

4. Start development server:
```bash
npm start
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

3. Login to Firebase:
```bash
firebase login
```

4. Initialize Firebase project:
```bash
firebase init
```

5. Install backend dependencies:
```bash
cd functions
npm install
```

6. Update email credentials in `functions/index.js`:
- Replace `your-email@gmail.com` with your Gmail
- Replace `your-app-password` with your Gmail App Password

7. Deploy functions:
```bash
firebase deploy --only functions
```

### Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Copy your Firebase config and update `frontend/src/firebase.js`
5. Deploy Firestore rules from `backend/firestore.rules`

## Project Structure

```
ap-proj/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── firebase.js
│   └── package.json
│
└── backend/
    ├── functions/
    │   ├── index.js
    │   └── package.json
    ├── firebase.json
    ├── firestore.rules
    └── firestore.indexes.json
```

## Usage

1. Sign up with your name, email, semester, and batch
2. Add subjects from your dashboard
3. Update total classes and attended classes for each subject
4. View real-time attendance percentage and recommendations
5. Use Bunk Predictor to simulate future attendance
6. Check your rank on the Leaderboard
7. Enable notifications in Profile settings

## Formulas

**Classes needed to reach 75%:**
```javascript
Math.ceil((75 * total - 100 * present) / 25)
```

**Classes available to bunk:**
```javascript
Math.floor((100 * present - 75 * total) / 75)
```

## License

MIT
# GP
