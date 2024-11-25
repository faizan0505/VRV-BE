const express = require("express");
const Role = require("../models/Role");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

// Get all roles
router.get("/", authenticate, authorize(["read"]), async (req, res) => {
  const roles = await Role.find();
  res.status(200).json({
    status: true,
    message: "Roles retrieved successfully",
    data: roles
  });
});

// Add a new role
router.post("/", authenticate, authorize(["write"]), async (req, res) => {
  const { name, permissions } = req.body;
  const newRole = new Role({ name, permissions });
  await newRole.save();
  res.status(201).json({
    status: true,
    message: "Role added successfully",
    data: newRole
  });
});

// Edit a role
router.patch("/:id", authenticate, authorize(["write"]), async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;
  const updatedRole = await Role.findByIdAndUpdate(
    id,
    { name, permissions },
    { new: true }
  );
  res.json({
    status: true,
    message: "Role updated successfully",
    data: updatedRole
  });
});

// Delete a role
router.delete("/:id", authenticate, authorize(["delete"]), async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: true,
    message: "Role deleted successfully"
  });
});

router.patch(
  "/permissions/:roleId",
  authenticate,
  authorize(["write"]),
  async (req, res) => {
    const { roleId } = req.params;
    const { permissions } = req.body;
    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      { permissions },
      { new: true }
    );
    res.json({
      status: true,
      message: "Permissions updated successfully",
      data: updatedRole
    });
  }
);

module.exports = router;
