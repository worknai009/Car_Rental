const express=require('express');
const router=express.Router();
const {conn,exe}=require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path=require('path');


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
const JWT_SECRET = "worknai";


// Admin register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email" });
    if (!passwordRegex.test(password)) return res.status(400).json({ message: "Password must have uppercase, lowercase, number, special char" });

    const exists = await exe("SELECT * FROM admins WHERE email=?", [email]);
    if (exists.length) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await exe("INSERT INTO admins(name,email,password) VALUES(?,?,?)", [name, email, hashedPassword]);
    res.json({ message: "Admin Registered Successfully" });
});

// Admin login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email & password required" });
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email" });

    const data = await exe("SELECT * FROM admins WHERE email=?", [email]);
    if (data.length === 0) return res.status(401).json({ message: "Invalid Credentials" });

    const user = data[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login Successful", token, user: { id: user.id, name: user.name, email: user.email } });
});


// Users routes
router.get("/users",async (req,res)=>{
    const sql=`select * from users`;
    const data=await exe(sql);
    res.json(data);
})

router.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await exe(
      "DELETE FROM users WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});


router.get("/reports/revenue", async (req, res) => {
    const sql = "SELECT SUM(total_amount) as total_revenue FROM bookings WHERE status='paid'";
    const data = await exe(sql);
    res.json(data[0]);
});

// Categories routes

router.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const sql = `INSERT INTO categories (name) VALUES (?)`;
    const data = await exe(sql, [name]);

    res.json({
      message: "Category Added Successfully",
      category_id: data.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add category" });
  }
});


router.get("/categories",async (req,res)=>{
    const sql=`select * from categories`;
    const data=await exe(sql);
    res.json(data);
});

router.put("/categories/:id", async (req, res) => {
    const id = req.params.id;
    const d = req.body;
    const sql = `UPDATE categories SET name=? WHERE id=?`;
    await exe(sql, [d.name, id]);
    res.json({ message: "Category Updated Successfully" });
});

router.delete("/categories/:id", async (req, res) => {  
    const id = req.params.id;

    // Check if any car is using this category
    const checkSql = "SELECT * FROM cars WHERE category_id=?";
    const cars = await exe(checkSql, [id]);
    if (cars.length > 0) {
        return res.status(400).json({ message: "Cannot delete category: it is used by some cars" });
    }

    // Delete category
    const sql = "DELETE FROM categories WHERE id=?";
    await exe(sql, [id]);
    res.json({ message: "Category Deleted Successfully" });
});


// Cars infomation routes

router.get("/cars", async (req, res) => {
  try {
    const sql = "SELECT * FROM cars";
    const data = await exe(sql);
    res.json(data);
  } catch (error) {
    console.error("Fetch Cars Error:", error);
    res.status(500).json({ message: "Failed to fetch cars", error: error.message });
  }
});

router.post("/cars", async (req, res) => {
  try {
    if (!req.files || !req.files.cars_image) {
      return res.status(400).json({ message: "Car image is required" });
    }

    const file = req.files.cars_image;
    const cars_image = Date.now() + "_" + file.name;
    await file.mv("public/" + cars_image);

    const { name, brand, car_details, category_id, price_per_day, is_available } = req.body;

    if (!name || !brand || !category_id || !price_per_day) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const sql = `
      INSERT INTO cars
      (name, brand, car_details, cars_image, category_id, price_per_day, is_available, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const data = await exe(sql, [
      name,
      brand,
      car_details || "",
      cars_image,
      category_id,
      price_per_day,
      is_available || 1
    ]);

    res.json({ message: "Car Added Successfully", id: data.insertId, cars_image });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: "Failed to add car", error: error.message });
  }
});


router.put("/cars/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // If the request has files (image)
    let cars_image = "";
    if (req.files && req.files.cars_image) {
      const file = req.files.cars_image;
      cars_image = Date.now() + "_" + file.name;
      await file.mv("public/" + cars_image);
    }

    // Destructure form data
    const { name, brand, car_details, category_id, price_per_day, is_available } = req.body;

    // If no new image uploaded, keep old image
    if (!cars_image) {
      const oldCar = await exe("SELECT cars_image FROM cars WHERE id=?", [id]);
      cars_image = oldCar[0]?.cars_image || "";
    }

    const sql = `
      UPDATE cars 
      SET name=?, brand=?, car_details=?, cars_image=?, category_id=?, price_per_day=?, is_available=?
      WHERE id=?
    `;
    await exe(sql, [name, brand, car_details, cars_image, category_id, price_per_day, is_available, id]);

    res.json({ message: "Car Updated Successfully", cars_image });
  } catch (error) {
    console.error("Failed to update car:", error);
    res.status(500).json({ message: "Failed to update car", error: error.message });
  }
});


router.delete("/cars/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Check if car exists
    const car = await exe("SELECT * FROM cars WHERE id=?", [id]);
    if (car.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Delete the car
    await exe("DELETE FROM cars WHERE id=?", [id]);
    res.json({ message: "Car Deleted Successfully" });
  } catch (error) {
    console.error("Delete Car Error:", error); // <-- log full error
    res.status(500).json({ message: "Failed to delete car", error: error.message });
  }
});


router.put("/cars/:id/availability", async (req, res) => {
    const id = req.params.id;
    const d = req.body; 
    const sql = `UPDATE cars SET is_available=? WHERE id=?`;
    await exe(sql, [d.is_available, id]);
    res.json({ message: "Car Availability Updated Successfully" });
});

// Bookings routes
router.get("/bookings", async (req, res) => {
  try {
    const sql = `
      SELECT 
        b.id,
        b.pickup_location,
        b.drop_location,
        b.start_date,
        b.end_date,
        b.total_amount,
        b.status,
        u.name AS user_name,
        c.name AS car_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN cars c ON b.car_id = c.id
      ORDER BY b.id DESC
    `;
    const data = await exe(sql);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});



router.put("/bookings/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = "UPDATE bookings SET status=? WHERE id=?";
  await exe(sql, [status, id]);

  res.json({ message: "Status updated permanently" });
});



// Invoice route
router.get("/bookings/:id/invoice", async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `
      SELECT 
        b.id as booking_id,
        u.name as user_name,
        u.email as user_email,
        u.phone,
        c.name as car_name,
        c.cars_image as car_image,
        b.total_amount,
        b.start_date,
        b.end_date,
        b.pickup_location,
        b.drop_location,
        b.status
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN cars c ON b.car_id = c.id
      WHERE b.id = ?
    `;
    const data = await exe(sql, [id]);
    if (!data.length) return res.status(404).json({ message: "Booking not found" });
    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// GET all bookings
router.get("/bookings", async (req, res) => {
  try {
    const sql = `
      SELECT 
        b.id,
        b.start_date,
        b.end_date,
        b.total_amount,
        b.status,
        u.name as user_name,
        u.email as user_email,
        c.name as car_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN cars c ON b.car_id = c.id
      ORDER BY b.id DESC
    `;
    const data = await exe(sql);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});


// feebbacks routes
router.get("/feedbacks",async (req,res)=>{
    const sql=`select f.id,f.comment,f.rating,u.name as user_name,c.name as car_name from feedbacks f join users u on f.user_id=u.id join cars c on f.car_id=c.id`;
    const data=await exe(sql);
    res.json(data);
});


// contact messages routes
router.get("/contacts",async (req,res)=>{
    const sql=`select * from contacts`;
    const data=await exe(sql);
    res.json(data);
});





// GET single booking invoice
router.get("/bookings/:id/invoice", async (req, res) => {
  try {
    const id = req.params.id;

    const sql = `
      SELECT 
        b.id as booking_id,
        b.pickup_location,
        b.drop_location,
        b.start_date,
        b.end_date,
        b.total_amount,
        b.status,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        c.name as car_name,
        c.cars_image as car_image
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN cars c ON b.car_id = c.id
      WHERE b.id = ?
    `;

    const data = await exe(sql, [id]);

    if (!data.length) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(data[0]); // return single invoice object
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/bar", async (req, res) => {
  try {
    const sql = `
      SELECT 
        DATE_FORMAT(b.start_date, '%b') AS month,
        cat.name AS category,
        SUM(b.total_amount) AS revenue
      FROM bookings b
      JOIN cars car ON b.car_id = car.id
      JOIN categories cat ON car.category_id = cat.id
      GROUP BY month, category
      ORDER BY MIN(b.start_date)
    `;

    const rows = await exe(sql);

    // Convert SQL rows → Nivo format
    const chartData = {};
    const keysSet = new Set();

    rows.forEach(r => {
      keysSet.add(r.category);

      if (!chartData[r.month]) {
        chartData[r.month] = { month: r.month };
      }

      chartData[r.month][r.category] = Number(r.revenue);
    });

    res.json({
      data: Object.values(chartData),
      keys: Array.from(keysSet),
    });

  } catch (err) {
    console.error("Bar chart error:", err);
    res.status(500).json({ message: "Bar chart error" });
  }
});


router.get("/pie", async (req, res) => {
  try {
    const sql = `
      SELECT 
        c.name AS category,
        COUNT(car.id) AS total
      FROM categories c
      LEFT JOIN cars car ON car.category_id = c.id
      GROUP BY c.id, c.name
    `;

    const result = await exe(sql);

    // FORMAT FOR NIVO PIE
    const formattedData = result.map(item => ({
      id: item.category,
      label: item.category,
      value: Number(item.total),
    }));

    res.json(formattedData);
  } catch (err) {
    console.error("Pie API error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// adminRoutes.js
router.get("/dashboard", async (req, res) => {
  try {
    const revenue = await exe("SELECT SUM(total_amount) AS total FROM bookings");
    const bookings = await exe("SELECT COUNT(*) AS total FROM bookings");
    const users = await exe("SELECT COUNT(*) AS total FROM users");
    const cars = await exe("SELECT COUNT(*) AS total FROM cars");

    res.json({
      totalRevenue: revenue[0].total || 0,
      bookingCount: bookings[0].total || 0,
      users: users[0].total || 0,
      cars: cars[0].total || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard error" });
  }
});



module.exports=router;