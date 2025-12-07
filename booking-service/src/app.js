const express = require('express');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/booking.routes');

const app = express();
app.use(bodyParser.json());

app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Booking Service running on port ${PORT}`);
});
