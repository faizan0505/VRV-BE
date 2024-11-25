const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

// Signup API
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if role exists
    const roleExists = await Role.findById(role);
    if (!roleExists) {
      return res.status(400).json({ error: "Invalid role ID" });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({
      status: true,
      message: "User registered successfully",
      data: newUser
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email }).populate("role");
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token valid for 1 day
    );

    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      data: user
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users
router.get("/", authenticate, authorize(["read"]), async (req, res) => {
  const users = await User.find().populate("role");
  res.json({
    status: true,
    message: "Users retrieved successfully",
    data: users
  });
});

// Add a new user
router.post("/", authenticate, authorize(["write"]), async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role });
  await newUser.save();
  res.status(201).json({
    status: true,
    message: "User created successfully",
    data: newUser
  });
});

// Edit a user
router.patch("/:id", authenticate, authorize(["write"]), async (req, res) => {
  const { id } = req.params;
  const { name, role, status } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { name, role, status },
    { new: true }
  );
  res.status(200).json({
    status: true,
    message: "User updated successfully",
    data: updatedUser
  });
});

// Delete a user
router.delete("/:id", authenticate, authorize(["delete"]), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: true,
    message: "User deleted successfully"
  });
});

module.exports = router;
