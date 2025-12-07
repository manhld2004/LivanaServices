// models/Booking.js
const { v4: uuidv4 } = require('uuid');
const BookingStatus = require('./booking-status.models');

class Booking {
  constructor({
    property_id,
    guest_id,
    host_id,
    check_in_day,
    check_out_day,
    total_price,
    guest_note,
    status = BookingStatus.ACCEPTED
  }) {
    this.id = uuidv4();
    this.property_id = property_id;
    this.guest_id = guest_id;
    this.host_id = host_id;
    this.status = status;
    this.check_in_day = check_in_day;
    this.check_out_day = check_out_day;
    this.total_price = total_price;
    this.guest_note = guest_note || '';
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}

module.exports = Booking;
