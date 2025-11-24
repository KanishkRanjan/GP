import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1>📚 Attendance Tracker</h1>
      </Link>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {currentUser ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/simulator">Bunk Predictor</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/profile">Profile</Link>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">
              <button className="btn btn-primary">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
