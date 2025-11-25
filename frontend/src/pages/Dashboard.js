import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { 
  calculateAttendance, 
  calculateAttendanceNeeded, 
  calculateDaysAvailableToBunk,
  getAttendanceStatus 
} from '../utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function Dashboard() {
  const { currentUser, userData } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    total: 0,
    attended: 0
  });

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
    setLoading(false);
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'subjects'), {
      ...newSubject,
      userId: currentUser.uid,
      semester: userData.semester
    });
    setNewSubject({ name: '', total: 0, attended: 0 });
    setShowAddModal(false);
    loadSubjects();
  };

  const handleUpdateSubject = async (id, field, value) => {
    await updateDoc(doc(db, 'subjects', id), { [field]: Number(value) });
    loadSubjects();
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Delete this subject?')) {
      await deleteDoc(doc(db, 'subjects', id));
      loadSubjects();
    }
  };

  const calculateOverallAttendance = () => {
    if (subjects.length === 0) return 0;
    const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
    const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
    return calculateAttendance(totalAttended, totalClasses);
  };

  const getChartData = () => {
    return subjects.map(subject => ({
      name: subject.name,
      value: Number(calculateAttendance(subject.attended, subject.total))
    }));
  };

  const COLORS = ['#2d3561', '#2f6f4f', '#c94240', '#d97706', '#5b7c99', '#8b5a3c'];

  if (loading) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px' 
      }}>
        <div>
          <h1 style={{ color: '#1a202c', fontSize: '28px', marginBottom: '6px', fontWeight: '700' }}>
            Welcome back, {userData?.name}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            Semester {userData?.semester} • Batch {userData?.batch}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          Add Subject
        </button>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
          Overall Attendance: {calculateOverallAttendance()}%
        </h2>
        <div className="progress-bar">
          <div 
            className={`progress-fill ${calculateOverallAttendance() >= 75 ? 'progress-green' : calculateOverallAttendance() >= 70 ? 'progress-yellow' : 'progress-red'}`}
            style={{ width: `${calculateOverallAttendance()}%` }}
          />
        </div>
      </div>

      {subjects.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
            Attendance Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getChartData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-2">
        {subjects.map(subject => {
          const percentage = calculateAttendance(subject.attended, subject.total);
          const needed = calculateAttendanceNeeded(subject.attended, subject.total);
          const bunkable = calculateDaysAvailableToBunk(subject.attended, subject.total);
          const status = getAttendanceStatus(percentage);

          return (
            <div key={subject.id} className="subject-card">
              <div className="flex-between" style={{ marginBottom: '16px' }}>
                <h3 style={{ color: '#1a202c', fontSize: '18px', fontWeight: '600' }}>{subject.name}</h3>
                <button 
                  className="btn btn-danger" 
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => handleDeleteSubject(subject.id)}
                >
                  Delete
                </button>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Total Classes</label>
                <input
                  type="number"
                  value={subject.total}
                  onChange={(e) => handleUpdateSubject(subject.id, 'total', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d1d5db', marginTop: '6px' }}
                  min="0"
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>Attended Classes</label>
                <input
                  type="number"
                  value={subject.attended}
                  onChange={(e) => handleUpdateSubject(subject.id, 'attended', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d1d5db', marginTop: '6px' }}
                  min="0"
                  max={subject.total}
                />
              </div>

              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '10px', border: '1px solid #e8eaed' }}>
                <p style={{ marginBottom: '8px', fontSize: '14px' }}>
                  <strong>Attendance:</strong> <span className={`status-${status.color}`}>{percentage}%</span>
                </p>
                <p style={{ marginBottom: '12px', fontSize: '14px' }}>
                  <strong>Status:</strong> <span className={`status-${status.color}`}>{status.status}</span>
                </p>
                
                {needed > 0 ? (
                  <div className="alert alert-warning" style={{ marginTop: '12px', padding: '10px', fontSize: '13px' }}>
                    Attend next <strong>{needed}</strong> {needed === 1 ? 'class' : 'classes'} to reach 75%
                  </div>
                ) : (
                  <div className="alert alert-success" style={{ marginTop: '12px', padding: '10px', fontSize: '13px' }}>
                    You can safely bunk <strong>{bunkable}</strong> {bunkable === 1 ? 'class' : 'classes'}
                  </div>
                )}

                <div className="progress-bar" style={{ marginTop: '12px' }}>
                  <div 
                    className={`progress-fill progress-${status.color}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {subjects.length === 0 && (
        <div className="card text-center" style={{ padding: '60px 40px' }}>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>No subjects yet. Click "Add Subject" to get started.</p>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Subject</h2>
            <form onSubmit={handleAddSubject}>
              <div className="input-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label>Total Classes</label>
                <input
                  type="number"
                  value={newSubject.total}
                  onChange={(e) => setNewSubject({ ...newSubject, total: Number(e.target.value) })}
                  min="0"
                  required
                />
              </div>

              <div className="input-group">
                <label>Attended Classes</label>
                <input
                  type="number"
                  value={newSubject.attended}
                  onChange={(e) => setNewSubject({ ...newSubject, attended: Number(e.target.value) })}
                  min="0"
                  max={newSubject.total}
                  required
                />
              </div>

              <div className="flex gap-10">
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Add Subject
                </button>
                <button 
                  type="button" 
                  className="btn" 
                  style={{ flex: 1, background: '#e2e8f0' }}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
