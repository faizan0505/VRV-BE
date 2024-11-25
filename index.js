const express = require("express");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");

const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/roles", roleRoutes);

app.listen(8080, () => console.log("Server running on port 3000"));
