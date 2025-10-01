import mongoose from "mongoose";

// Setup for Jest tests
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = '129f6ba7526f8856dac500c3569b9382';
  process.env.MONGODB_URI = 'mongodb+srv://brianmwendwa180:Mwendwa123456@cluster0.miju7ci.mongodb.net';
});

afterAll(async () => {
  // Clean up after all tests
  await mongoose.disconnect();
});
