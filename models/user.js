import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiration: {
    type: Date,
    required: true,
  },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;

