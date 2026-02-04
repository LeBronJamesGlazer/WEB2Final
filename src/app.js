const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const premiumRoutes = require('./routes/premiumRoutes');

const app = express();

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Form data parser

app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
})); // Security headers (relaxed for simple frontend)
if(process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev')); // Logging
}

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/premium', premiumRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
