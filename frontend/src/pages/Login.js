import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to login. Check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f8f9fb',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        <div className="card" style={{ padding: '48px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h1 style={{ 
              color: '#2d3561', 
              fontSize: '32px', 
              fontWeight: '700',
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>
              Welcome back
            </h1>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>
              Sign in to continue to BunkMate
            </p>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '8px', padding: '14px' }} 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ 
            marginTop: '28px', 
            textAlign: 'center',
            paddingTop: '24px',
            borderTop: '1px solid #e8eaed'
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ 
                color: '#2d3561', 
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
