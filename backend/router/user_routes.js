const express = require('express');
const router = express.Router();
const { exe } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendOTP = require('../email');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
        return res.status(401).json({ message: "Login required" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, email }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
const JWT_SECRET = "worknai";

// ------------------- USERS -------------------

// Get all users
router.get('/users', async (req, res) => {
    const sql = `SELECT id, name, email FROM users`;
    const data = await exe(sql);
    res.json(data);
});

// User register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email" });
    if (!passwordRegex.test(password)) return res.status(400).json({ message: "Password must have uppercase, lowercase, number, special char" });

    const exists = await exe("SELECT * FROM users WHERE email=?", [email]);
    if (exists.length) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await exe("INSERT INTO users(name,email,password) VALUES(?,?,?)", [name, email, hashedPassword]);
    res.json({ message: "User Registered Successfully" });
});

// User login - send OTP

// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password)
//         return res.status(400).json({ message: "Email & password required" });

//     const data = await exe("SELECT * FROM users WHERE email=?", [email]);
//     if (data.length === 0)
//         return res.status(401).json({ message: "Invalid Credentials" });

//     const user = data[0];
//     const match = await bcrypt.compare(password, user.password);
//     if (!match)
//         return res.status(401).json({ message: "Invalid Credentials" });

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

//     // Save OTP
//     await exe(
//         "UPDATE users SET otp=?, otp_expiry=? WHERE id=?",
//         [otp, expiry, user.id]
//     );

//     // Send OTP
//     await sendOTP(user.email, otp);

//     res.json({
//         message: "OTP sent to your email",
//         user_id: user.id
//     });
// });

// router.post("/verify-otp", async (req, res) => {
//     const { user_id, otp } = req.body;

//     if (!user_id || !otp)
//         return res.status(400).json({ message: "OTP required" });

//     const data = await exe("SELECT * FROM users WHERE id=?", [user_id]);
//     if (data.length === 0)
//         return res.status(400).json({ message: "User not found" });

//     const user = data[0];

//     if (user.otp !== otp)
//         return res.status(401).json({ message: "Invalid OTP" });

//     if (new Date() > user.otp_expiry)
//         return res.status(401).json({ message: "OTP expired" });

//     // Clear OTP
//     await exe("UPDATE users SET otp=NULL, otp_expiry=NULL WHERE id=?", [user_id]);

//     // Generate JWT
//     const token = jwt.sign(
//         { id: user.id, email: user.email },
//         JWT_SECRET,
//         { expiresIn: "1d" }
//     );

//     res.json({
//         message: "Login Successful",
//         token,
//         user: {
//             id: user.id,
//             name: user.name,
//             email: user.email
//         }
//     });
// });

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email & password required" });

  const data = await exe("SELECT * FROM users WHERE email=?", [email]);
  if (data.length === 0)
    return res.status(401).json({ message: "Invalid Credentials" });

  const user = data[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ message: "Invalid Credentials" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  await exe(
    "UPDATE users SET otp=?, otp_expiry=? WHERE id=?",
    [otp, expiry, user.id]
  );

  await sendOTP(user.email, otp);

  res.json({
    message: "OTP sent to your email",
    user_id: user.id
  });
});

router.post("/verify-otp", async (req, res) => {
  const { user_id, otp } = req.body;

  if (!user_id || !otp)
    return res.status(400).json({ message: "OTP required" });

  const data = await exe("SELECT * FROM users WHERE id=?", [user_id]);
  if (data.length === 0)
    return res.status(400).json({ message: "User not found" });

  const user = data[0];

  // ✅ FIX HERE
  if (user.otp !== Number(otp))
    return res.status(401).json({ message: "Invalid OTP" });

  if (new Date() > user.otp_expiry)
    return res.status(401).json({ message: "OTP expired" });

  await exe("UPDATE users SET otp=NULL, otp_expiry=NULL WHERE id=?", [user_id]);

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login Successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});


// Get user profile
router.get("/user/:id", async (req, res) => {
    const id = req.params.id;
    const data = await exe("SELECT id, name, email FROM users WHERE id=?", [id]);
    if (data.length) res.json(data[0]);
    else res.status(404).json({ message: "User not found" });
});

// Update user profile
router.put("/user/:id", async (req, res) => {
    const id = req.params.id;
    const { name, email, password } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email required" });
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email" });

    let sql, params;
    if (password) {
        if (!passwordRegex.test(password)) return res.status(400).json({ message: "Weak password" });
        const hashedPassword = await bcrypt.hash(password, 10);
        sql = "UPDATE users SET name=?, email=?, password=? WHERE id=?";
        params = [name, email, hashedPassword, id];
    } else {
        sql = "UPDATE users SET name=?, email=? WHERE id=?";
        params = [name, email, id];
    }

    await exe(sql, params);
    res.json({ message: "Profile updated successfully" });
});

// ------------------- CATEGORIES & CARS -------------------

router.get("/categories", async (req, res) => {
    const sql = `SELECT * FROM categories`;
    const data = await exe(sql);
    res.json(data);
});

router.get("/cars", async (req, res) => {
    const sql = `SELECT * FROM cars`;
    const data = await exe(sql);
    res.json(data);
});

router.get("/card/:id", async (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM cars WHERE id=?`;
    const data = await exe(sql, [id]);
    res.json(data[0]);
});

// Filter cars
router.get("/cars/filter", async (req, res) => {
    const { category_id, price_min, price_max, available } = req.query;
    let sql = "SELECT * FROM cars WHERE 1=1";
    const params = [];
    if (category_id) { sql += " AND category_id=?"; params.push(category_id); }
    if (price_min) { sql += " AND price_per_day>=?"; params.push(price_min); }
    if (price_max) { sql += " AND price_per_day<=?"; params.push(price_max); }
    if (available) { sql += " AND is_available=?"; params.push(available); }

    const data = await exe(sql, params);
    res.json(data);
});

// ------------------- BOOKINGS -------------------

// router.post("/bookings", async (req, res) => {
//     const d = req.body;
//     const carData = await exe("SELECT price_per_day FROM cars WHERE id=?", [d.car_id]);
//     if (!carData.length) return res.status(404).json({ message: "Car not found" });

//     const price_per_day = carData[0].price_per_day;
//     const fromDate = new Date(d.start_date);
//     const toDate = new Date(d.end_date);
//     if (toDate < fromDate) return res.status(400).json({ message: "Invalid date range" });

//     const totalDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
//     const total_amount = totalDays * price_per_day;

//     await exe("INSERT INTO bookings (user_id, car_id, pickup_location, drop_location, start_date, end_date, total_amount, status) VALUES (?,?,?,?,?,?)",
//         [d.user_id, d.car_id, d.pickup_location, d.drop_location, d.start_date, d.end_date, total_amount, "Booked"]
//     );

//     res.json({ message: "Car Booked Successfully", days: totalDays, price_per_day, total_amount });
// });

router.post("/bookings",async (req, res) => {
    const d = req.body;
    const user_id = req.user.id; // from JWT ✅

    const carData = await exe(
        "SELECT price_per_day FROM cars WHERE id=?",
        [d.car_id]
    );

    if (!carData.length)
        return res.status(404).json({ message: "Car not found" });

    const price_per_day = carData[0].price_per_day;
    const fromDate = new Date(d.start_date);
    const toDate = new Date(d.end_date);

    if (toDate < fromDate)
        return res.status(400).json({ message: "Invalid date range" });

    const totalDays =
        Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

    const total_amount = totalDays * price_per_day;

    await exe(
        `INSERT INTO bookings 
        (user_id, car_id, pickup_location, drop_location, start_date, end_date, total_amount, status)
        VALUES (?,?,?,?,?,?,?,?)`,
        [
            user_id,
            d.car_id,
            d.pickup_location,
            d.drop_location,
            d.start_date,
            d.end_date,
            total_amount,
            "Booked"
        ]
    );

    res.json({
        message: "Car Booked Successfully",
        days: totalDays,
        price_per_day,
        total_amount
    });
});

// Check booking availability
router.post("/bookings/check", async (req, res) => {
    const d = req.body;
    const data = await exe("SELECT * FROM bookings WHERE car_id=? AND start_date<=? AND end_date>=?", [d.car_id, d.to_date, d.from_date]);
    res.json(data.length ? { message: "Car is already booked" } : { message: "Car is available" });
});

// Get user bookings
router.get("/bookings/user/:user_id", async (req, res) => {
    const user_id = req.params.user_id;
    const data = await exe(
        "SELECT b.id,b.pickup_location, b.drop_location, b.start_date, b.end_date, b.total_amount, b.status, c.name as car_name, c.cars_image as car_image FROM bookings b JOIN cars c ON b.car_id=c.id WHERE b.user_id=?",
        [user_id]
    );
    res.json(data);
});


// Cancel booking
router.put("/bookings/cancel/:id", async (req, res) => {
    const id = req.params.id;
    await exe("UPDATE bookings SET status='Cancelled' WHERE id=?", [id]);
    res.json({ message: "Booking Cancelled Successfully" });
});

router.get("/bookings/:id/invoice", async (req, res) => {
    const id = req.params.id;
    const sql = `SELECT 
            b.id as booking_id,
            b.start_date,
            b.end_date,
            b.pickup_location,
            b.drop_location,
            b.total_amount,
            b.status,
            u.name as user_name,
            u.email as user_email,
            c.name as car_name,
            c.cars_image as car_image
        FROM bookings b
        JOIN users u ON b.user_id=u.id
        JOIN cars c ON b.car_id=c.id
        WHERE b.id=?
    `;
    const data = await exe(sql, [id]);
    res.json(data[0]);
});


// Mark booking as paid
router.post("/bookings/:id/pay", async (req, res) => {
    const booking_id = req.params.id;
    await exe("UPDATE bookings SET status='Paid' WHERE id=?", [booking_id]);
    res.json({ message: "Payment successful" });
});

// ------------------- FEEDBACK -------------------

router.post("/feedback", async (req, res) => {
    const d = req.body;
    await exe("INSERT INTO feedback(user_id,message,rating) VALUES(?,?,?)", [d.user_id, d.message, d.rating]);
    res.json({ message: "Feedback Submitted Successfully" });
});


// Get user feedback
router.get("/feedback/user/:user_id", async (req, res) => {
    const user_id = req.params.user_id;
    const data = await exe("SELECT * FROM feedback WHERE user_id=?", [user_id]);
    res.json(data);
});

// Get car reviews
router.get("/cars/:id/reviews", async (req, res) => {
    const car_id = req.params.id;
    const data = await exe(`
        SELECT f.comments, f.rating, u.name as user_name
        FROM feedback f
        JOIN users u ON f.user_id = u.id
        WHERE f.car_id=?`, [car_id]
    );
    res.json(data);
});

// ------------------- CONTACT -------------------

router.post("/contact", async (req, res) => {
    const d = req.body;
    await exe("INSERT INTO contact(user_id,name,email,subject,message) VALUES(?,?,?,?,?)", [d.user_id, d.name, d.email, d.subject, d.message]);
    res.json({ message: "Contact Message Sent Successfully" });
});

module.exports = router;
