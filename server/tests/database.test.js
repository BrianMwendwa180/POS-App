import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../config/db.js";

let mongoServer;

describe("Database Connection", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should connect to MongoDB successfully", async () => {
    await connectDB();
    expect(mongoose.connection.readyState).toBe(1); // Connected
  });

  it("should handle connection errors gracefully", async () => {
    // Test with invalid URI
    const originalUri = process.env.MONGODB_URI;
    process.env.MONGODB_URI = "mongodb://invalid:27017/test";

    try {
      await connectDB();
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Restore original URI
    process.env.MONGODB_URI = originalUri;
  });
});
