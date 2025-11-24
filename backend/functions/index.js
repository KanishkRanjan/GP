const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

const calculateAttendance = (present, total) => {
  if (total === 0) return 0;
  return ((present / total) * 100).toFixed(2);
};

exports.checkAttendanceAlert = functions.firestore
  .document('subjects/{subjectId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();

    const userId = newData.userId;
    const subjectName = newData.name;
    const attendance = calculateAttendance(newData.attended, newData.total);

    if (attendance < 75 && calculateAttendance(oldData.attended, oldData.total) >= 75) {
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();

      if (userData.notificationsEnabled) {
        const mailOptions = {
          from: 'your-email@gmail.com',
          to: userData.email,
          subject: '⚠️ Attendance Alert - Below 75%',
          html: `
            <h2>Attendance Warning!</h2>
            <p>Hi ${userData.name},</p>
            <p>Your attendance for <strong>${subjectName}</strong> has dropped below 75%.</p>
            <p><strong>Current Attendance:</strong> ${attendance}%</p>
            <p>Please attend upcoming classes to maintain your attendance.</p>
            <br>
            <p>Best regards,<br>Attendance Tracker Team</p>
          `
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log('Alert email sent to:', userData.email);
        } catch (error) {
          console.error('Error sending email:', error);
        }
      }
    }
  });

exports.generateLeaderboard = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  try {
    const usersSnapshot = await db.collection('users').get();
    const subjectsSnapshot = await db.collection('subjects').get();

    const userAttendance = {};

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

    subjectsSnapshot.docs.forEach(doc => {
      const subject = doc.data();
      if (userAttendance[subject.userId]) {
        userAttendance[subject.userId].totalClasses += subject.total;
        userAttendance[subject.userId].attendedClasses += subject.attended;
      }
    });

    const leaderboard = Object.keys(userAttendance)
      .map(userId => {
        const data = userAttendance[userId];
        return {
          ...data,
          attendance: calculateAttendance(data.attendedClasses, data.totalClasses)
        };
      })
      .filter(student => student.totalClasses > 0)
      .sort((a, b) => b.attendance - a.attendance);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error generating leaderboard:', error);
    res.status(500).json({ error: 'Failed to generate leaderboard' });
  }
});

exports.sendWeeklyReport = functions.pubsub
  .schedule('every sunday 18:00')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    const usersSnapshot = await db.collection('users').get();

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      if (!userData.notificationsEnabled) continue;

      const userId = userDoc.id;
      const subjectsQuery = await db.collection('subjects')
        .where('userId', '==', userId)
        .get();

      let totalClasses = 0;
      let attendedClasses = 0;
      let subjectsBelow75 = [];

      subjectsQuery.docs.forEach(doc => {
        const subject = doc.data();
        totalClasses += subject.total;
        attendedClasses += subject.attended;

        const attendance = calculateAttendance(subject.attended, subject.total);
        if (attendance < 75) {
          subjectsBelow75.push({
            name: subject.name,
            attendance: attendance
          });
        }
      });

      const overallAttendance = calculateAttendance(attendedClasses, totalClasses);

      let subjectsList = '';
      if (subjectsBelow75.length > 0) {
        subjectsList = '<h3>Subjects Below 75%:</h3><ul>';
        subjectsBelow75.forEach(subject => {
          subjectsList += `<li>${subject.name}: ${subject.attendance}%</li>`;
        });
        subjectsList += '</ul>';
      }

      const mailOptions = {
        from: 'your-email@gmail.com',
        to: userData.email,
        subject: '📊 Weekly Attendance Report',
        html: `
          <h2>Weekly Attendance Summary</h2>
          <p>Hi ${userData.name},</p>
          <p><strong>Overall Attendance:</strong> ${overallAttendance}%</p>
          <p><strong>Total Classes:</strong> ${totalClasses}</p>
          <p><strong>Classes Attended:</strong> ${attendedClasses}</p>
          ${subjectsList}
          <p>Keep up the good work!</p>
          <br>
          <p>Best regards,<br>Attendance Tracker Team</p>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Weekly report sent to:', userData.email);
      } catch (error) {
        console.error('Error sending weekly report:', error);
      }
    }

    return null;
  });
