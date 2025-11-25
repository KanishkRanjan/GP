import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute><Navbar /><Dashboard /></PrivateRoute>} />
          <Route path="/simulator" element={<PrivateRoute><Navbar /><Simulator /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><Navbar /><Leaderboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Navbar /><Profile /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
