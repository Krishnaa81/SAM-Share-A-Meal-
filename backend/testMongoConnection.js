const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    // Check if MongoDB URI is set
    const mongoURI = process.env.MONGODB_URI;
    console.log('MongoDB URI:', mongoURI ? 'URI is set' : 'URI is not set');
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    // Print the masked URI (hiding password for security)
    const maskedURI = mongoURI.replace(/:([^:@]+)@/, ':****@');
    console.log('Masked MongoDB URI:', maskedURI);
    
    // Set mongoose options
    const options = {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4 // Use IPv4, skip trying IPv6
    };
    
    console.log('Attempting to connect to MongoDB...');
    
    // Attempt connection
    const conn = await mongoose.connect(mongoURI, options);
    
    console.log('MongoDB Connected Successfully!');
    console.log(`Connected to database: ${conn.connection.name}`);
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Port: ${conn.connection.port}`);
    
    // List collections
    console.log('Available collections:');
    const collections = await conn.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('No collections found in the database');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed');
    
    return true; // Connection successful
  } catch (error) {
    console.error('MongoDB connection error:');
    
    // Log detailed error information
    if (error.name) console.error(`Error type: ${error.name}`);
    if (error.code) console.error(`Error code: ${error.code}`);
    
    // Check for specific error types
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to any MongoDB server in the connection string');
      console.error('Possible causes:');
      console.error('- Network connectivity issues');
      console.error('- MongoDB server is down');
      console.error('- Incorrect hostname or port');
      console.error('- Firewall blocking connection');
    }
    
    if (error.code === 'ENOTFOUND') {
      console.error('The MongoDB hostname was not found');
      console.error('Check your MongoDB URI for typos in the hostname');
    }
    
    if (error.code === 'ETIMEDOUT') {
      console.error('Connection timed out');
      console.error('The MongoDB server did not respond in time');
    }
    
    if (error.message.includes('bad auth')) {
      console.error('Authentication failed');
      console.error('Check your username and password in the MongoDB URI');
    }
    
    console.error(error);
    
    return false; // Connection failed
  }
};

// Run the test
testConnection()
  .then(success => {
    console.log(`Test completed, success: ${success}`);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error during test:', err);
    process.exit(1);
  }); 