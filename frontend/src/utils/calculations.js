export const calculateAttendance = (present, total) => {
  if (total === 0) return 0;
  return ((present / total) * 100).toFixed(2);
};

export const calculateAttendanceNeeded = (present, total) => {
  const needed = Math.ceil((75 * total - 100 * present) / 25);
  return needed > 0 ? needed : 0;
};

export const calculateDaysAvailableToBunk = (present, total) => {
  const available = Math.floor((100 * present - 75 * total) / 75);
  return available > 0 ? available : 0;
};

export const getAttendanceStatus = (percentage) => {
  if (percentage >= 75) return { color: 'green', status: 'Safe' };
  if (percentage >= 70) return { color: 'yellow', status: 'Warning' };
  return { color: 'red', status: 'Critical' };
};

export const predictAttendance = (present, total, classesToBunk) => {
  const newTotal = total + classesToBunk;
  return calculateAttendance(present, newTotal);
};
