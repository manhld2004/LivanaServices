const BookingRepository = require('../repositories/booking.repository');
// const PropertyRepository = require('../repositories/property.repository');
// const UserRepository = require('../repositories/user.repository');
const Booking = require('../models/booking.models');
const BookingStatus = require('../models/booking-status.models');
//const PropertyStatus = require('../models/booking.models');

const BookingService = {
  async createBooking(data) {
    // Tạo object Booking mới
    const booking = new Booking(data);


    //const property = await PropertyRepository.getById(booking.property_id);
    if (!property) throw new Error('Property not found');

    // Cập nhật ngày đã book cho property
    if (!property.links || property.links.length === 0) {
      // await PropertyRepository.updateBookedDate(booking.property_id, booking.check_in_day, booking.check_out_day);
      // await PropertyRepository.update(booking.property_id, { status: PropertyStatus.Idle });
    } else {
      // await PropertyRepository.updateBookedDateWithLinksTransaction(booking.property_id, booking.check_in_day, booking.check_out_day);
      // await PropertyRepository.updatePropertyStatusWithLinksTransaction(booking.property_id, PropertyStatus.Idle);
    }

    // Lưu booking vào Firestore
    await BookingRepository.createBooking(booking);
    return booking;
  },

  async getAllBookingsByHostID(hostId) {
    return await BookingRepository.getAllBookingsByHostID(hostId);
  },

  async getAllBookingsByGuestID(guestId) {
    return await BookingRepository.getAllBookingsByGuestID(guestId);
  },

  async getBookingById(bookingId) {
    return await BookingRepository.getBookingById(bookingId);
  },

  async inProgressBooking(currentUserID, bookingId) {
    const booking = await BookingRepository.getBookingById(bookingId);
    if (booking.status !== BookingStatus.ACCEPTED) throw new Error('Booking status must be ACCEPTED');
    if (booking.host_id !== currentUserID) throw new Error('Only host can start booking');

    // Cập nhật trạng thái booking
    await BookingRepository.updateBookingStatus(bookingId, BookingStatus.IN_PROGRESS);

    // Cập nhật trạng thái property
    //const property = await PropertyRepository.getById(booking.property_id);
    if (!property.links || property.links.length === 0) {
      //await PropertyRepository.update(booking.property_id, { status: PropertyStatus.Renting });
    } else {
      //await PropertyRepository.updatePropertyStatusWithLinksTransaction(booking.property_id, PropertyStatus.Renting);
    }
  },

  async completeBooking(currentUserID, bookingId) {
    //const booking = await BookingRepository.getBookingById(bookingId);
    if (booking.status !== BookingStatus.IN_PROGRESS) throw new Error('Booking status must be IN_PROGRESS');
    if (booking.host_id !== currentUserID) throw new Error('Only host can complete booking');

    //await BookingRepository.updateBookingStatus(bookingId, BookingStatus.COMPLETED);

    // Thêm vào renting history của guest
    //await UserRepository.addRentingHistory(booking.guest_id, booking.id);

    // Cập nhật trạng thái property
    const property = await PropertyRepository.getById(booking.property_id);
    if (!property.links || property.links.length === 0) {
      //await PropertyRepository.update(booking.property_id, { status: PropertyStatus.Idle });
    } else {
      //await PropertyRepository.updatePropertyStatusWithLinksTransaction(booking.property_id, PropertyStatus.Idle);
    }
  },

  async setReviewedBooking(bookingId) {
    const booking = await BookingRepository.getBookingById(bookingId);
    if (booking.status !== BookingStatus.COMPLETED) throw new Error('Booking status must be COMPLETED');
    await BookingRepository.updateBookingStatus(bookingId, BookingStatus.REVIEWED);
  },

  async cancelBooking(currentUserID, bookingId) {
    const booking = await BookingRepository.getBookingById(bookingId);
    const cannotCancel = [BookingStatus.COMPLETED, BookingStatus.IN_PROGRESS, BookingStatus.REVIEWED];
    if (cannotCancel.includes(booking.status)) throw new Error('Cannot cancel this booking');
    if (!(booking.host_id === currentUserID || booking.guest_id === currentUserID))
      throw new Error('Only host or guest can cancel booking');

    await BookingRepository.updateBookingStatus(bookingId, BookingStatus.CANCELLED);

    // Xóa booked date khỏi property
    // const property = await PropertyRepository.getById(booking.property_id);
    // if (!property.links || property.links.length === 0) {
    //   await PropertyRepository.removeBookedDates(booking.property_id, booking.check_in_day, booking.check_out_day);
    //   await PropertyRepository.update(booking.property_id, { status: PropertyStatus.Idle });
    // } else {
    //   await PropertyRepository.removeBookedDatesWithLinkTransaction(booking.property_id, booking.check_in_day, booking.check_out_day);
    //   await PropertyRepository.updatePropertyStatusWithLinksTransaction(booking.property_id, PropertyStatus.Idle);
    // }
  },

  async checkGuestIsBookingHostProperty(guestId, hostId) {
    return await BookingRepository.checkGuestIsBookingHostProperty(guestId, hostId);
  },

  async getBookingsByPropertyId(propertyId) {
    return await BookingRepository.getBookingsByPropertyId(propertyId);
  },

  async getCompletedBookings() {
    return await BookingRepository.getCompletedBookings();
  }
};

module.exports = BookingService;
