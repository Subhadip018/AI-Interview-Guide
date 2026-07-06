const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js DNS resolver to use Google and Cloudflare DNS
// This bypasses ISP DNS blocks/failures on SRV queries (fixes querySrv ECONNREFUSED)
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,              // Force IPv4 — fixes querySrv ECONNREFUSED
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
