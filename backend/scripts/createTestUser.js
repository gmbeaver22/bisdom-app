const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

async function createTestUser() {
  try {
    await mongoose.connect("mongodb://localhost:27017/bisdom");
    
    const hashedPassword = await bcrypt.hash("password123", 10);
    const testUser = new User({
      email: "test@example.com",
      password: hashedPassword,
    });
    
    await testUser.save();
    console.log("Test user created successfully");
  } catch (error) {
    console.error("Error creating test user:", error);
  } finally {
    mongoose.disconnect();
  }
}

createTestUser(); 