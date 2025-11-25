import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <h1>BunkMate</h1>
      </Link>
      
      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/simulator">Bunk Predictor</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/profile">Profile</Link>
        <button 
          className="btn btn-danger" 
          onClick={handleLogout}
          style={{ padding: '10px 20px', fontSize: '14px' }}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
