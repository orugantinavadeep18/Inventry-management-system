// seed.js
import bcrypt from "bcryptjs";
import User from "./models/user.js";
import connectDB from "./config/db.js";


const register = async () => {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email: "admin@gmail.com" });
    if (existingUser) {
      console.log("❌ Admin user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin", 10);

    const newUser = new User({
      name: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,  // hashed password
      address: "admin address",
      role: "admin"
    });

    await newUser.save();
    console.log("✅ Admin user created successfully (email: admin@gmail.com, password: admin)");
  } catch (error) {
    console.log("❌ Error creating admin user:", error.message);
  }
};

register();
