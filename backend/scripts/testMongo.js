const mongoose = require("mongoose");

async function testConnection() {
  try {
    await mongoose.connect("mongodb://localhost:27017/bisdom");
    console.log("Successfully connected to MongoDB");

    // Test creating a collection
    await mongoose.connection.db.createCollection("test");
    console.log("Successfully created test collection");

    // Clean up
    await mongoose.connection.db.dropCollection("test");
    console.log("Successfully cleaned up test collection");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();
