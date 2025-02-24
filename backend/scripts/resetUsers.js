const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

async function resetUsers() {
  try {
    await mongoose.connect("mongodb://localhost:27017/bisdom");
    console.log("Connected to MongoDB");

    // Drop existing users
    await User.deleteMany({});
    console.log("Deleted all existing users");

    // Create new test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const testUser = new User({
      email: "test@example.com",
      password: hashedPassword,
      role: "user",
    });

    await testUser.save();
    console.log("Created test user:", {
      email: testUser.email,
      role: testUser.role,
    });

    // Verify user was created
    const users = await User.find({});
    console.log(
      "All users in database:",
      users.map((u) => ({
        id: u._id,
        email: u.email,
        role: u.role,
      }))
    );
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

resetUsers();
