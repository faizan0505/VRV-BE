const Role = require("../models/Role");

const authorize = (requiredPermissions) => async (req, res, next) => {
  const userRole = req.user.role;
  const role = await Role.findById(userRole);
  if (!role) return res.status(403).json({ error: "Role not found" });

  const hasPermissions = requiredPermissions.every((item) =>
    role.permissions.includes(item)
  );
  if (!hasPermissions) return res.status(403).json({ error: "Forbidden" });

  next();
};

module.exports = authorize;
