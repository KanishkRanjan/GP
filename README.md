# BunkMate

A full-stack web application that helps college students track and control their attendance.

## Features

- **Authentication**: Sign up/Login with Firebase Auth
- **Dashboard**: Track attendance for all subjects with real-time calculations
- **Bunk Predictor**: Simulate future attendance before making decisions
- **Leaderboard**: Compare attendance with peers
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

### Quick Start (100% Free)

```bash
# Install dependencies
cd frontend
npm install

# Start the app
npm start
```

**Before running**, you need to:
1. Create a Firebase project (free)
2. Enable Authentication & Firestore
3. Update `frontend/src/firebase.js` with your config

**👉 See detailed step-by-step guide: [FREE_SETUP.md](FREE_SETUP.md)**

---

### Manual Setup
- Node.js (v16 or higher)
- Firebase account (free tier)
- Git

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "BunkMate"
3. Enable **Authentication** (Email/Password method)
4. Enable **Firestore Database** (start in test mode)
5. Get your Firebase config from Project Settings

### 2. Configure Frontend

```bash
cd frontend

# Install dependencies
npm install
```

Update `src/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Deploy Firestore Security Rules

```bash
cd backend
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### 4. Start the Application

```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000`

---

## 100% Free - No Backend Functions Required

This version runs entirely on Firebase's free tier:
- ✅ Authentication
- ✅ Firestore Database
- ✅ Real-time attendance tracking
- ✅ Leaderboard
- ✅ All core features

**Note**: Email notifications and scheduled reports require Cloud Functions (paid tier). See [SETUP_GUIDE.md](SETUP_GUIDE.md) if you want to enable those features.

---

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
