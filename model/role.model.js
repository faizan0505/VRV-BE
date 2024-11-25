const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    permissions: [
      {
        type: String
      }
    ] // Example: ['Read', 'Write', 'Delete']
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("roles", roleSchema);
