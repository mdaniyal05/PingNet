const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockUntil: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
