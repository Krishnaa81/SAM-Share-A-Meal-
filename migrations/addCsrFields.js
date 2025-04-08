const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Create uploads directories needed for CSR documents
const createDirectories = () => {
  const dirs = [
    path.join(__dirname, '../uploads'),
    path.join(__dirname, '../uploads/receipts'),
    path.join(__dirname, '../uploads/certificates')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    } else {
      console.log(`Directory already exists: ${dir}`);
    }
  });
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Migrate corporate users to add CSR fields
const migrateUsers = async () => {
  try {
    // Find all corporate users
    const corporateUsers = await User.find({ role: 'corporate' });
    console.log(`Found ${corporateUsers.length} corporate users`);

    let updated = 0;

    // Update each corporate user
    for (const user of corporateUsers) {
      // Add default CSR-related fields if they don't exist
      let isUpdated = false;

      // Ensure company details are set
      if (!user.companyName) {
        user.companyName = user.name || 'Company';
        isUpdated = true;
      }

      // Generate a GST number if not present
      if (!user.gstNumber) {
        // Mock GST number format: 22AAAAA0000A1Z5
        const randomGST = `${Math.floor(Math.random() * 35) + 1}${Array(5).fill(0).map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('')}${Array(4).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}1Z${Math.floor(Math.random() * 9)}`;
        user.gstNumber = randomGST;
        isUpdated = true;
      }

      // Set company size if not present
      if (!user.companySize) {
        // Random company size between 10 and 1000
        user.companySize = Math.floor(Math.random() * 990) + 10;
        isUpdated = true;
      }

      // Set annual revenue if not present
      if (!user.annualRevenue) {
        // Random annual revenue between 1M and 100M
        user.annualRevenue = (Math.floor(Math.random() * 99) + 1) * 1000000;
        isUpdated = true;
      }

      if (isUpdated) {
        await user.save();
        updated++;
        console.log(`Updated corporate user: ${user.email}`);
      }
    }

    console.log(`Migration completed. Updated ${updated} corporate users.`);
  } catch (error) {
    console.error(`Error during migration: ${error.message}`);
  }
};

// Run the migration
const runMigration = async () => {
  try {
    // Create necessary directories
    createDirectories();

    // Connect to the database
    const conn = await connectDB();

    // Run the migration
    await migrateUsers();

    // Close the database connection
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error(`Migration failed: ${error.message}`);
  }
};

// Execute the migration if this file is run directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration }; 