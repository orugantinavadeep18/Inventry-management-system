import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "staff", "user"],
    default: "user"
  }
}, { timestamps: true });

// ✅ Prevent overwrite when model is already compiled (especially during dev reloads)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
