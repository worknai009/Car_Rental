const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimit = require("express-rate-limit");
const logger = require("./src/utils/logger");
const { sequelize } = require("./src/config/db");
const models = require("./src/models/index");

// SYNC DATABASE
sequelize.sync({ alter: false }).then(() => {
  logger.info("Database synced (Sequelize) ✅");
}).catch(err => {
  logger.error("Database sync error (Sequelize): " + err.message);
});


const user_routes = require("./src/routes/user/index");
const car_register = require("./src/routes/car-register/index");

const app = express();

// --- SECURITY: BASE PROTECTION ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin images
}));

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    exposedHeaders: ["Content-Disposition", "Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    abortOnLimit: true,
  })
);

app.use("/api/public", express.static("public"));
app.use("/api/uploads", express.static(path.join(__dirname, "public", "uploads")));

// --- SECURITY: RATE LIMITING ---
// 1. General limiter for all API routes (100 per 15 mins)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true, 
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

// 2. Stricter limiter for Auth (10 per 15 mins to prevent brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts, please try again after 15 minutes" },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/verify-otp", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.use("/api/auth/reset-password", authLimiter);

// 3. Very strict limiter for Contact (3 per hour to stop spam bots)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 3, 
  message: { message: "Message limit reached. Please try again after an hour." },
});
app.use("/api/contact", contactLimiter);

// ROUTES
app.use("/api/", user_routes);
app.use("/api/car-register", car_register);

const PORT = process.env.MAIN_PORT || process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
