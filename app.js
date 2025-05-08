// app.js
const express = require("express");
const app = express();

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

const swaggerUi = require("swagger-ui-express");
const userSwaggerDoc = require("./docs/user.swagger");
const adminSwaggerDoc = require("./docs/admin.swagger");

// Security Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Global Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP
});
app.use(limiter);

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/admins", adminRoutes);

// Swagger Docs
app.use("/api/docs/user", swaggerUi.serve, swaggerUi.setup(userSwaggerDoc));
app.use("/api/docs/admin", swaggerUi.serve, swaggerUi.setup(adminSwaggerDoc));

module.exports = app;
