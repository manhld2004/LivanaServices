const BookingRepository = require('../repositories/booking.repository');
// const PropertyRepository = require('../repositories/property.repository');
// const UserRepository = require('../repositories/user.repository');
const BookingStatus = require('../models/booking-status.models');
//const PropertyStatus = require('../models/PropertyStatus');

class BookingService {
    constructor() {
        this.bookingRepository = BookingRepository;
        //this.propertyRepository = new PropertyRepository();
        //this.userRepository = new UserRepository();
    }

    async createBooking(booking) {
        const property = await this.propertyRepository.getPropertyById(booking.property_id);
        if (!property.links || property.links.length === 0) {
            // await this.propertyRepository.updateBookedDate(booking.property_id, booking.check_in_day, booking.check_out_day);
            // await this.propertyRepository.updatePropertyStatus(booking.property_id, PropertyStatus.Idle);
        } else {
            // await this.propertyRepository.updateBookedDateWithLinksTransaction(booking.property_id, booking.check_in_day, booking.check_out_day);
            // await this.propertyRepository.updatePropertyStatusWithLinksTransaction(booking.property_id, PropertyStatus.Idle);
        }
        await this.bookingRepository.createBooking(booking);
    }

    async getAllBookingsByHostID(hostId) {
        return await this.bookingRepository.getAllBookingsByHostID(hostId);
    }

    async getAllBookingsByGuestID(guestId) {
        return await this.bookingRepository.getAllBookingsByGuestID(guestId);
    }

    async getBookingById(bookingId) {
        return await this.bookingRepository.getBookingById(bookingId);
    }

    async inProgressBooking(currentUserID, bookingId) {
        const booking = await this.bookingRepository.getBookingById(bookingId);
        if (booking.status !== Booking_status.ACCEPTED) throw new Error('Booking status must be ACCEPTED');
        if (booking.host_id !== currentUserID) throw new Error('Only host can start booking');
        await this.bookingRepository.updateBookingStatus(bookingId, Booking_status.IN_PROGRESS);
        // const property = await this.propertyRepository.getPropertyById(booking.property_id);
        // if (!property.links || property.links.length === 0) {
        //     await this.propertyRepository.updatePropertyStatus(booking.property_id, PropertyStatus.Renting);
        // } else {
        //     await this.propertyRepository.updatePropertyStatusWithLinksTransaction(booking.property_id, PropertyStatus.Renting);
        // }
    }

    async completeBooking(currentUserID, bookingId) {
        const booking = await this.bookingRepository.getBookingById(bookingId);
        if (booking.status !== Booking_status.IN_PROGRESS) throw new Error('Booking status must be IN_PROGRESS');
        if (booking.host_id !== currentUserID) throw new Error('Only host can complete booking');
        await this.bookingRepository.updateBookingStatus(bookingId, Booking_status.COMPLETED);
        await this.userRepository.addRentingHistory(booking.guest_id, booking.id);
        // const property = await this.propertyRepository.getPropertyById(booking.property_id);
        // if (!property.links || property.links.length === 0) {
        //     await this.propertyRepository.updatePropertyStatus(booking.property_id, PropertyStatus.Idle);
        // } else {
        //     await this.propertyRepository.updatePropertyStatusWithLinksTransaction(booking.property_id, PropertyStatus.Idle);
        // }
    }

    async setReviewedBooking(bookingId) {
        const booking = await this.bookingRepository.getBookingById(bookingId);
        if (booking.status !== Booking_status.COMPLETED) throw new Error('Booking status must be COMPLETED');
        await this.bookingRepository.updateBookingStatus(bookingId, Booking_status.REVIEWED);
    }

    async cancelBooking(userID, bookingId) {
        const booking = await this.bookingRepository.getBookingById(bookingId);
        if ([Booking_status.COMPLETED, Booking_status.IN_PROGRESS, Booking_status.REVIEWED].includes(booking.status))
            throw new Error('Cannot cancel this booking');
        if (!(booking.host_id === userID || booking.guest_id === userID))
            throw new Error('Only host or guest can cancel booking');

        await this.bookingRepository.updateBookingStatus(bookingId, Booking_status.CANCELLED);

        // const property = await this.propertyRepository.getPropertyById(booking.property_id);
        // if (!property.links || property.links.length === 0) {
        //     await this.propertyRepository.removeBookedDates(booking.property_id, booking.check_in_day, booking.check_out_day);
        //     await this.propertyRepository.updatePropertyStatus(booking.property_id, PropertyStatus.Idle);
        // } else {
        //     await this.propertyRepository.removeBookedDatesWithLinkTransaction(booking.property_id, booking.check_in_day, booking.check_out_day);
        //     await this.propertyRepository.updatePropertyStatusWithLinksTransaction(booking.property_id, PropertyStatus.Idle);
        // }
    }

    async checkGuestIsBookingHostProperty(guestId, hostId) {
        return await this.bookingRepository.checkGuestIsBookingHostProperty(guestId, hostId);
    }
}

module.exports = BookingService;
