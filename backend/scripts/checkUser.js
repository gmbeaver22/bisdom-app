const mongoose = require("mongoose");
const User = require("../models/user");

async function checkUser() {
  try {
    await mongoose.connect("mongodb://localhost:27017/bisdom");
    console.log("Connected to MongoDB");

    const users = await User.find({});
    console.log(
      "All users:",
      users.map((u) => ({ email: u.email }))
    );
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUser();
