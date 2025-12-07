// models/BookingStatus.js
const BookingStatus = Object.freeze({
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REVIEWED: 'REVIEWED'
});

module.exports = BookingStatus;
