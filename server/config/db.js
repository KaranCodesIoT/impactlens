import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/impactlens';

  // Do not attempt if placeholder string is left unchanged
  if (uri.includes('<user>') || uri.includes('<pass>') || uri.includes('<db_password>')) {
    console.error('\n⚠️ MONGODB_URI in .env contains placeholder credentials (<user>/<pass>).');
    console.error('   Please replace them with your actual MongoDB credentials or use local MongoDB.\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error(`\n❌ MongoDB connection error: ${error.message}`);
    console.error(`   Please check your MONGODB_URI in .env or start MongoDB service.`);
    console.error(`   Attempted URI: ${uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}\n`);
    return false;
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('✅ MongoDB connected');
});

export const getDBStatus = () => isConnected;
export default connectDB;
