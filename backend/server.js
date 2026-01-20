require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");

const user_routes = require("./src/routes/user/index");
const admin_routes = require("./src/routes/admin/admin.routes");
const car_register = require("./src/routes/car-register/index");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
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

app.use("/public", express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// ROUTES
app.use("/", user_routes);
app.use("/admin", admin_routes);
app.use("/car-register", car_register);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
