require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function checkAuth() {
  try {
    console.log('Checking authentication system and MongoDB connection...');
    
    // Check JWT secret
    console.log('JWT Secret:', process.env.JWT_SECRET ? 'Exists ✅' : 'Missing ❌');
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully ✅');
    
    // Check for User model
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} users in the database`);
    
    // Check if admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    console.log('Admin user exists:', adminExists ? 'Yes ✅' : 'No ❌');
    
    // If no admin exists, create one
    if (!adminExists) {
      console.log('Creating admin user...');
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      // Create admin
      const admin = new User({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '1234567890',
        role: 'admin'
      });
      
      await admin.save();
      console.log('Admin user created ✅');
    }
    
    // Check token generation
    const token = jwt.sign(
      { id: adminExists ? adminExists._id : 'test' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('Token generation test:', token ? 'Successful ✅' : 'Failed ❌');
    
    console.log('\nAuth system check complete. If there are any issues, fix them in the corresponding files.');
    console.log('Ensure cookies are being properly set and CORS is configured correctly.');
  } catch (error) {
    console.error('Error during auth check:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

checkAuth(); 