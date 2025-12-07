const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

router.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// CRUD
router.post('/', bookingController.createBooking);
router.get('/host/:hostId', bookingController.getAllBookingsByHostID);
router.get('/guest/:guestId', bookingController.getAllBookingsByGuestID);
router.get('/:bookingId', bookingController.getBookingById);
router.put('/inprogress/:bookingId', bookingController.inProgressBooking);
router.put('/complete/:bookingId', bookingController.completeBooking);
router.put('/review/:bookingId', bookingController.setReviewedBooking);
router.put('/cancel/:bookingId', bookingController.cancelBooking);
router.get('/check/:guestId/:hostId', bookingController.checkGuestIsBookingHostProperty);

module.exports = router;

