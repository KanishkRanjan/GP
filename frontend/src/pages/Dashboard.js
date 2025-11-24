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

  const COLORS = ['#667eea', '#48bb78', '#f56565', '#ecc94b', '#38b2ac', '#ed8936'];

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#2d3748' }}>Welcome, {userData?.name}!</h1>
          <p style={{ color: '#718096' }}>Semester {userData?.semester} | Batch {userData?.batch}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Subject
        </button>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>Overall Attendance: {calculateOverallAttendance()}%</h2>
        <div className="progress-bar">
          <div 
            className={`progress-fill ${calculateOverallAttendance() >= 75 ? 'progress-green' : calculateOverallAttendance() >= 70 ? 'progress-yellow' : 'progress-red'}`}
            style={{ width: `${calculateOverallAttendance()}%` }}
          />
        </div>
      </div>

      {subjects.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Attendance Distribution</h3>
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
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <h3 style={{ color: '#2d3748' }}>{subject.name}</h3>
                <button 
                  className="btn btn-danger" 
                  style={{ padding: '6px 12px', fontSize: '14px' }}
                  onClick={() => handleDeleteSubject(subject.id)}
                >
                  Delete
                </button>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '14px', color: '#718096' }}>Total Classes</label>
                <input
                  type="number"
                  value={subject.total}
                  onChange={(e) => handleUpdateSubject(subject.id, 'total', e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                  min="0"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '14px', color: '#718096' }}>Attended Classes</label>
                <input
                  type="number"
                  value={subject.attended}
                  onChange={(e) => handleUpdateSubject(subject.id, 'attended', e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                  min="0"
                  max={subject.total}
                />
              </div>

              <div style={{ background: '#f7fafc', padding: '12px', borderRadius: '8px' }}>
                <p><strong>Attendance:</strong> <span className={`status-${status.color}`}>{percentage}%</span></p>
                <p><strong>Status:</strong> <span className={`status-${status.color}`}>{status.status}</span></p>
                
                {needed > 0 ? (
                  <div className="alert alert-warning" style={{ marginTop: '8px', padding: '8px' }}>
                    ⚠️ Attend next <strong>{needed}</strong> classes to reach 75%
                  </div>
                ) : (
                  <div className="alert alert-success" style={{ marginTop: '8px', padding: '8px' }}>
                    ✅ You can safely bunk <strong>{bunkable}</strong> classes
                  </div>
                )}

                <div className="progress-bar" style={{ marginTop: '8px' }}>
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
        <div className="card text-center">
          <p style={{ color: '#718096', fontSize: '18px' }}>No subjects yet. Click "Add Subject" to get started!</p>
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
