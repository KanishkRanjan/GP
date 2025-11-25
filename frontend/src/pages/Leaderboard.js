import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { calculateAttendance } from '../utils/calculations';

export default function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const subjectsSnapshot = await getDocs(collection(db, 'subjects'));

      const userAttendance = {};

      // Initialize user data
      usersSnapshot.docs.forEach(doc => {
        const userData = doc.data();
        userAttendance[doc.id] = {
          name: userData.name,
          semester: userData.semester,
          batch: userData.batch,
          totalClasses: 0,
          attendedClasses: 0
        };
      });

      // Aggregate attendance data
      subjectsSnapshot.docs.forEach(doc => {
        const subject = doc.data();
        if (userAttendance[subject.userId]) {
          userAttendance[subject.userId].totalClasses += subject.total;
          userAttendance[subject.userId].attendedClasses += subject.attended;
        }
      });

      // Calculate attendance and sort
      const leaderboardData = Object.keys(userAttendance)
        .map(userId => {
          const data = userAttendance[userId];
          return {
            ...data,
            attendance: calculateAttendance(data.attendedClasses, data.totalClasses)
          };
        })
        .filter(student => student.totalClasses > 0)
        .sort((a, b) => b.attendance - a.attendance);

      setStudents(leaderboardData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    return `${index + 1}`;
  };

  if (loading) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading leaderboard...</div>;

  return (
    <div className="container" style={{ maxWidth: '900px', marginTop: '40px' }}>
      <div className="card">
        <h1 style={{ color: '#1a202c', marginBottom: '12px', fontSize: '28px', fontWeight: '700' }}>
          Leaderboard
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '28px', fontSize: '15px' }}>
          Top students ranked by attendance percentage
        </p>

        {students.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Semester</th>
                <th>Batch</th>
                <th>Attendance %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td style={{ fontSize: '16px', fontWeight: '700', color: index < 3 ? '#2d3561' : '#4b5563' }}>
                    {getRankIcon(index)}
                  </td>
                  <td style={{ fontWeight: '500' }}>{student.name}</td>
                  <td>Sem {student.semester}</td>
                  <td>{student.batch}</td>
                  <td style={{ fontSize: '16px', fontWeight: '600' }}>
                    {student.attendance}%
                  </td>
                  <td>
                    <span className={
                      student.attendance >= 75 ? 'status-green' : 
                      student.attendance >= 70 ? 'status-yellow' : 
                      'status-red'
                    }>
                      {student.attendance >= 75 ? 'Safe' : 
                       student.attendance >= 70 ? 'Warning' : 
                       'Critical'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-warning">
            No students with attendance data found.
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ color: '#1a202c', marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          About Rankings
        </h3>
        <ul style={{ paddingLeft: '20px', color: '#4b5563', lineHeight: '1.8', fontSize: '14px' }}>
          <li>Rankings are based on overall attendance percentage</li>
          <li>Only students with recorded attendance are shown</li>
          <li>Top performers are highlighted with bold ranking</li>
          <li>Color codes: Green (≥75%), Yellow (70-74%), Red (&lt;70%)</li>
        </ul>
      </div>
    </div>
  );
}
