const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email is required and should be unique"]
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles"
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("users", userSchema);
