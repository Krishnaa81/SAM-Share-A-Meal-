const { exec } = require('child_process');

console.log('Checking if MongoDB is running locally...');

// For Windows
exec('powershell.exe -Command "Get-Service MongoDB -ErrorAction SilentlyContinue | Select-Object -Property Name, Status"', (error, stdout, stderr) => {
  if (error) {
    console.log('Error checking MongoDB service on Windows:', error.message);
    console.log('MongoDB might not be installed as a service.');
    
    // Try checking for mongod process
    exec('powershell.exe -Command "Get-Process mongod -ErrorAction SilentlyContinue | Select-Object -Property ProcessName, Id"', (error, stdout, stderr) => {
      if (error) {
        console.log('Error checking for mongod process:', error.message);
        console.log('MongoDB might not be running. Please install and start MongoDB:');
        console.log('1. Download MongoDB from https://www.mongodb.com/try/download/community');
        console.log('2. Install MongoDB as a service or start it manually.');
        return;
      }
      
      if (stdout.includes('mongod')) {
        console.log('MongoDB is running as a process:');
        console.log(stdout);
      } else {
        console.log('MongoDB process not found. Please install and start MongoDB.');
      }
    });
    
    return;
  }
  
  if (stdout.includes('Running')) {
    console.log('MongoDB service is running:');
    console.log(stdout);
  } else {
    console.log('MongoDB service is not running:');
    console.log(stdout);
    console.log('Please start the MongoDB service with: net start MongoDB');
  }
});

// Try to connect to MongoDB on port 27017
const net = require('net');
const client = new net.Socket();
const port = 27017;
const host = 'localhost';

client.setTimeout(5000);

client.on('connect', function() {
  console.log(`Port ${port} is open, MongoDB is likely accepting connections`);
  client.destroy();
});

client.on('timeout', function() {
  console.log(`Connection to port ${port} timed out. MongoDB might not be running.`);
  client.destroy();
});

client.on('error', function(err) {
  console.log(`Cannot connect to port ${port}:`, err.message);
  console.log('MongoDB might not be running. Please start MongoDB server.');
});

client.connect(port, host); 