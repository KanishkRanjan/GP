import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    semester: '',
    batch: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.semester,
        formData.batch
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
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
              Create Account
            </h1>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>
              Join BunkMate to track your attendance
            </p>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                minLength={6}
              />
            </div>

            <div className="input-group">
              <label>Semester</label>
              <select name="semester" value={formData.semester} onChange={handleChange} required>
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Batch</label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="e.g., 2021-2025"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '8px', padding: '14px' }} 
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ 
            marginTop: '28px', 
            textAlign: 'center',
            paddingTop: '24px',
            borderTop: '1px solid #e8eaed'
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ 
                color: '#2d3561', 
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
