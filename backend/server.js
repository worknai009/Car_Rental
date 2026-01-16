require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const user_routes = require("./src/routes/user/index");
const admin_routes = require("./src/routes/admin/admin.routes");
const car_register = require("./src/routes/car-register/carRegisterAuth.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
     credentials: true,
    exposedHeaders: ["Content-Disposition", "Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/public", express.static("public"));

// ROUTES
app.use("/", user_routes);
app.use("/admin", admin_routes);
app.use("/car-register", car_register);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
