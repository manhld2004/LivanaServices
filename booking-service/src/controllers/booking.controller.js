const BookingService = require('../services/booking.service');
const bookingService = new BookingService();

exports.createBooking = async (req, res) => {
    try {
        const booking = req.body;
        await bookingService.createBooking(booking);
        res.status(201).send({ message: 'Booking created successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.getAllBookingsByHostID = async (req, res) => {
    try {
        const hostId = req.params.hostId;
        const bookings = await bookingService.getAllBookingsByHostID(hostId);
        res.send(bookings);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.getAllBookingsByGuestID = async (req, res) => {
    try {
        const guestId = req.params.guestId;
        const bookings = await bookingService.getAllBookingsByGuestID(guestId);
        res.send(bookings);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await bookingService.getBookingById(bookingId);
        res.send(booking);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
};

exports.inProgressBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const currentUserID = req.body.userId;
        await bookingService.inProgressBooking(currentUserID, bookingId);
        res.send({ message: 'Booking status updated to IN_PROGRESS' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.completeBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const currentUserID = req.body.userId;
        await bookingService.completeBooking(currentUserID, bookingId);
        res.send({ message: 'Booking completed successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.setReviewedBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        await bookingService.setReviewedBooking(bookingId);
        res.send({ message: 'Booking reviewed successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const currentUserID = req.body.userId;
        await bookingService.cancelBooking(currentUserID, bookingId);
        res.send({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.checkGuestIsBookingHostProperty = async (req, res) => {
    try {
        const { guestId, hostId } = req.params;
        const status = await bookingService.checkGuestIsBookingHostProperty(guestId, hostId);
        res.send({ status });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};
