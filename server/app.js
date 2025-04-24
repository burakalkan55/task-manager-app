const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes"); 
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require('./routes/taskRoutes');

// Route configurations
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/tasks', taskRoutes);

module.exports = app;
