import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

dotenv.config();

connectDB().then(async () => {
  try {
    await mongoose.connection.db.collection('products2').dropIndex('barcode_1');
    console.log('barcode_1 index dropped successfully');
  } catch (err) {
    console.error('Error dropping index:', err.message);
  }
  process.exit(0);
}).catch(err => {
  console.error('DB connection error:', err.message);
  process.exit(1);
});
