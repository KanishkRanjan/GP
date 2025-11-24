import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const { currentUser, userData, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    semester: userData?.semester || '',
    batch: userData?.batch || '',
    notificationsEnabled: userData?.notificationsEnabled || false
  });
  const [success, setSuccess] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'users', currentUser.uid), formData);
    setSuccess('Profile updated successfully!');
    setEditing(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="container" style={{ maxWidth: '700px', marginTop: '40px' }}>
      <div className="card">
        <h1 style={{ color: '#667eea', marginBottom: '24px' }}>👤 Profile</h1>

        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleUpdate}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!editing}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={currentUser?.email}
              disabled
              style={{ background: '#f7fafc', cursor: 'not-allowed' }}
            />
          </div>

          <div className="input-group">
            <label>Semester</label>
            <select 
              value={formData.semester} 
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              disabled={!editing}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Batch</label>
            <input
              type="text"
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              disabled={!editing}
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={formData.notificationsEnabled}
                onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
                disabled={!editing}
                style={{ width: 'auto' }}
              />
              Enable Email Notifications (when attendance drops below 75%)
            </label>
          </div>

          <div className="flex gap-10">
            {!editing ? (
              <>
                <button 
                  type="button"
                  className="btn btn-primary" 
                  onClick={() => setEditing(true)}
                  style={{ flex: 1 }}
                >
                  Edit Profile
                </button>
                <button 
                  type="button"
                  className="btn btn-danger" 
                  onClick={handleLogout}
                  style={{ flex: 1 }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  type="submit"
                  className="btn btn-success" 
                  style={{ flex: 1 }}
                >
                  Save Changes
                </button>
                <button 
                  type="button"
                  className="btn" 
                  onClick={() => setEditing(false)}
                  style={{ flex: 1, background: '#e2e8f0' }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ color: '#2d3748', marginBottom: '16px' }}>Account Information</h3>
        <p style={{ color: '#718096' }}>
          <strong>Account Created:</strong> {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
        </p>
        <p style={{ color: '#718096', marginTop: '8px' }}>
          <strong>User ID:</strong> {currentUser?.uid}
        </p>
      </div>
    </div>
  );
}
