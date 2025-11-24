import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { predictAttendance, calculateAttendance } from '../utils/calculations';

export default function Simulator() {
  const { currentUser } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [classesToBunk, setClassesToBunk] = useState(1);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, [currentUser]);

  const loadSubjects = async () => {
    if (!currentUser) return;
    
    const q = query(collection(db, 'subjects'), where('userId', '==', currentUser.uid));
    const snapshot = await getDocs(q);
    const subjectsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setSubjects(subjectsData);
  };

  const handlePredict = () => {
    const subject = subjects.find(s => s.id === selectedSubject);
    if (!subject) return;

    const currentAttendance = calculateAttendance(subject.attended, subject.total);
    const predictedAttendance = predictAttendance(subject.attended, subject.total, classesToBunk);
    
    setPrediction({
      subjectName: subject.name,
      current: currentAttendance,
      predicted: predictedAttendance,
      isSafe: predictedAttendance >= 75
    });
  };

  return (
    <div className="container" style={{ maxWidth: '700px', marginTop: '40px' }}>
      <div className="card">
        <h1 style={{ color: '#667eea', marginBottom: '24px' }}>🎯 Bunk Predictor</h1>
        <p style={{ color: '#718096', marginBottom: '24px' }}>
          Simulate future attendance before making decisions
        </p>

        <div className="input-group">
          <label>Select Subject</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Choose a subject</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name} - Current: {calculateAttendance(subject.attended, subject.total)}%
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Number of Classes to Bunk</label>
          <input
            type="number"
            value={classesToBunk}
            onChange={(e) => setClassesToBunk(Number(e.target.value))}
            min="1"
          />
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          onClick={handlePredict}
          disabled={!selectedSubject}
        >
          Predict Attendance
        </button>

        {prediction && (
          <div style={{ marginTop: '24px' }}>
            <div className={`alert ${prediction.isSafe ? 'alert-success' : 'alert-danger'}`}>
              <h3 style={{ marginBottom: '12px' }}>Prediction for {prediction.subjectName}</h3>
              <p><strong>Current Attendance:</strong> {prediction.current}%</p>
              <p><strong>After Bunking {classesToBunk} classes:</strong> {prediction.predicted}%</p>
              <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)' }} />
              {prediction.isSafe ? (
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  ✅ Safe! You'll still be above 75%
                </p>
              ) : (
                <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  🚨 Risky! You'll drop below 75%
                </p>
              )}
            </div>
          </div>
        )}

        {subjects.length === 0 && (
          <div className="alert alert-warning" style={{ marginTop: '20px' }}>
            No subjects found. Add subjects from your dashboard first.
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ color: '#2d3748', marginBottom: '16px' }}>How It Works</h3>
        <ul style={{ paddingLeft: '20px', color: '#4a5568', lineHeight: '1.8' }}>
          <li>Select any subject from your list</li>
          <li>Enter the number of classes you plan to bunk</li>
          <li>See your predicted attendance percentage</li>
          <li>Green alert = Safe to bunk</li>
          <li>Red alert = Don't bunk, attendance will drop</li>
        </ul>
      </div>
    </div>
  );
}
