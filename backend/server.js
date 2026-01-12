require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const user_routes = require("./src/routes/user/index");
const admin_routes = require("./src/routes/admin/admin.routes");

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

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
