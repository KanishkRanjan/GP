import { Link } from 'react-router-dom';
import { useState } from 'react';
import { calculateAttendance, calculateAttendanceNeeded, calculateDaysAvailableToBunk } from '../utils/calculations';

export default function Home() {
  const [demoTotal, setDemoTotal] = useState(20);
  const [demoPresent, setDemoPresent] = useState(15);

  const percentage = calculateAttendance(demoPresent, demoTotal);
  const needed = calculateAttendanceNeeded(demoPresent, demoTotal);
  const bunkable = calculateDaysAvailableToBunk(demoPresent, demoTotal);

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', marginTop: '40px' }}>
        <h1 style={{ color: '#667eea', fontSize: '48px', marginBottom: '16px' }}>
          📚 75% Attendance Tracker
        </h1>
        <p style={{ fontSize: '20px', color: '#4a5568', marginBottom: '32px' }}>
          Track your attendance, predict bunks, and stay above 75%
        </p>
        
        <div className="flex" style={{ justifyContent: 'center', gap: '16px' }}>
          <Link to="/signup">
            <button className="btn btn-primary">Get Started</button>
          </Link>
          <Link to="/login">
            <button className="btn" style={{ background: '#e2e8f0', color: '#2d3748' }}>Login</button>
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#2d3748' }}>
          Try Demo Calculator
        </h2>
        
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="input-group">
            <label>Total Classes</label>
            <input
              type="number"
              value={demoTotal}
              onChange={(e) => setDemoTotal(Number(e.target.value))}
              min="0"
            />
          </div>

          <div className="input-group">
            <label>Attended Classes</label>
            <input
              type="number"
              value={demoPresent}
              onChange={(e) => setDemoPresent(Number(e.target.value))}
              min="0"
              max={demoTotal}
            />
          </div>

          <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
            <h3 style={{ marginBottom: '12px' }}>Results:</h3>
            <p><strong>Attendance:</strong> {percentage}%</p>
            <p><strong>Status:</strong> 
              <span className={percentage >= 75 ? 'status-green' : percentage >= 70 ? 'status-yellow' : 'status-red'}>
                {percentage >= 75 ? ' ✅ Safe' : percentage >= 70 ? ' ⚠️ Warning' : ' 🚨 Critical'}
              </span>
            </p>
            {needed > 0 ? (
              <p className="status-red"><strong>Attend next {needed} classes to reach 75%</strong></p>
            ) : (
              <p className="status-green"><strong>You can bunk {bunkable} classes safely!</strong></p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: '40px' }}>
        <div className="card">
          <h3 style={{ color: '#667eea', marginBottom: '12px' }}>✨ Smart Calculations</h3>
          <p>Get instant calculations on classes needed or available to bunk</p>
        </div>
        <div className="card">
          <h3 style={{ color: '#667eea', marginBottom: '12px' }}>📊 Visual Tracking</h3>
          <p>Beautiful charts and progress bars for each subject</p>
        </div>
        <div className="card">
          <h3 style={{ color: '#667eea', marginBottom: '12px' }}>🎯 Bunk Predictor</h3>
          <p>Simulate future attendance before taking decisions</p>
        </div>
        <div className="card">
          <h3 style={{ color: '#667eea', marginBottom: '12px' }}>🏆 Leaderboard</h3>
          <p>Compare your attendance with peers</p>
        </div>
      </div>
    </div>
  );
}
