const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const staffRoutes = require('./routes/staff');
const customerRoutes = require('./routes/customers');
const roomRoutes = require('./routes/rooms');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const invoiceRoutes = require('./routes/invoices'); // Import route invoice
const reportRoutes = require('./routes/reports');
const roomTypeRoutes = require('./routes/roomTypes');
const promotionRoutes = require('./routes/promotions');
const reviewRoutes = require('./routes/reviews');

// Register Routes
app.use('/api/staff', staffRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/invoices', invoiceRoutes); // Đăng ký route invoice
app.use('/api/reports', reportRoutes);
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/reviews', reviewRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Hotel Management API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Check Email Config (Optional)
    if(process.env.EMAIL_USER) {
        console.log("=== EMAIL CONFIG LOADED ===");
        console.log("User:", process.env.EMAIL_USER);
        console.log("===========================");
    }
});