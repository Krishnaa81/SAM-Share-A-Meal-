const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Support both common frontend ports
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser()); // Add cookie-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Improved MongoDB connection with error handling
const connectDB = async () => {
  const MAX_RETRIES = 3;
  let retries = 0;
  let connected = false;

  while (retries < MAX_RETRIES && !connected) {
    try {
      // Log the MongoDB URI (with credentials masked)
      const maskedURI = process.env.MONGODB_URI
        ? process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@')
        : 'No MongoDB URI provided';
      
      console.log(`Attempt ${retries + 1}/${MAX_RETRIES}: Connecting to MongoDB with URI:`, maskedURI);
      
      // Check if MongoDB URI is defined
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }
      
      // Set mongoose options for better stability
      const mongooseOptions = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };
      
      const conn = await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
      
      connected = true;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      console.log(`Database Name: ${conn.connection.name}`);
      
      // List all collections in the database
      console.log('Available collections:');
      const collections = await conn.connection.db.listCollections().toArray();
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
      
    } catch (error) {
      retries++;
      console.error(`MongoDB connection error (Attempt ${retries}/${MAX_RETRIES}): ${error.message}`);
      console.error('Error type:', error.name);
      console.error('Error code:', error.code);
      
      if (error.name === 'MongooseServerSelectionError') {
        console.error('Server selection timed out. Check your MongoDB URI and network connectivity.');
      }
      
      if (error.code === 'ENOTFOUND') {
        console.error('Hostname not found. Check your MongoDB URI hostname.');
      }
      
      if (error.code === 'ETIMEDOUT') {
        console.error('Connection timed out. Check your network connectivity and firewall settings.');
      }
      
      if (retries < MAX_RETRIES) {
        console.log(`Retrying in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error('Maximum retry attempts reached. Could not connect to MongoDB.');
        // Don't exit in development to allow for troubleshooting
        if (process.env.NODE_ENV === 'production') {
          process.exit(1);
        }
      }
    }
  }
};

// Connect to the database
connectDB();

// Basic route
app.get('/', (req, res) => {
  res.send('Food Delivery, Donation & CSR Credit System API is running');
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/users', require('./routes/user.routes'));
app.use('/api/restaurants', require('./routes/restaurant.routes'));
app.use('/api/orders', require('./routes/order.routes'));
// app.use('/api/donations', require('./routes/donation.routes'));
// app.use('/api/cloud-kitchen', require('./routes/cloudKitchen.routes'));
app.use('/api/csr', require('./routes/csr.routes'));

// Menu items routes
app.use('/api/menu-items', require('./routes/menuItem.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 