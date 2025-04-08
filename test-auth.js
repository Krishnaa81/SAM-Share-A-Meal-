const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Load the user model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const testAuth = async () => {
  try {
    // Test user
    const testUser = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      phone: '1234567890',
      role: 'user',
      status: 'active'
    };

    console.log('1. Checking if test user already exists...');
    // Check if user exists, if so, delete for clean test
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('Test user exists, deleting...');
      await User.deleteOne({ email: testUser.email });
      console.log('Test user deleted');
    } else {
      console.log('Test user not found, creating new...');
    }

    console.log('2. Creating test user directly in database...');
    // Hash the password manually for direct insertion
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);
    console.log('Password hash:', hashedPassword);
    
    // Create user with manual insertion to bypass mongoose middleware
    await User.collection.insertOne({
      name: testUser.name,
      email: testUser.email,
      password: hashedPassword,
      phone: testUser.phone,
      role: testUser.role,
      status: testUser.status,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Test user created successfully with manual insertion');

    console.log('3. Testing login with valid credentials...');
    // Test login with correct password
    const validUser = await User.findOne({ email: testUser.email });
    if (!validUser) {
      throw new Error('User not found after creation!');
    }
    
    console.log('Found user with ID:', validUser._id);
    console.log('Stored password hash:', validUser.password);
    
    // Direct comparison using bcrypt
    const isValidPassword = await bcrypt.compare(testUser.password, validUser.password);
    console.log('Direct bcrypt.compare result:', isValidPassword);
    
    // Model method comparison
    const isValidWithModel = await validUser.comparePassword(testUser.password);
    console.log('Model comparePassword result:', isValidWithModel);
    
    if (isValidPassword) {
      console.log('✅ Login successful with direct bcrypt.compare');
    } else {
      console.log('❌ Login failed with direct bcrypt.compare!');
    }
    
    if (isValidWithModel) {
      console.log('✅ Login successful with model.comparePassword');
    } else {
      console.log('❌ Login failed with model.comparePassword!');
    }

    console.log('4. Testing login with invalid credentials...');
    // Test login with wrong password
    const isInvalidPassword = await bcrypt.compare('wrongpassword', validUser.password);
    console.log('Invalid password check result:', isInvalidPassword);
    if (!isInvalidPassword) {
      console.log('✅ Login correctly rejected with wrong password');
    } else {
      console.log('❌ Login incorrectly succeeded with wrong password!');
    }

    console.log('All tests completed');
  } catch (err) {
    console.error('Error during testing:', err);
  } finally {
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the test
testAuth(); 