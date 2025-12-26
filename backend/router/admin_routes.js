const express=require('express');
const router=express.Router();
const {conn,exe}=require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    const id = req.params.id;
    await exe("DELETE FROM users WHERE id=?", [id]);
    res.json({ message: "User Deleted Successfully" });
});

router.get("/reports/revenue", async (req, res) => {
    const sql = "SELECT SUM(total_amount) as total_revenue FROM bookings WHERE status='paid'";
    const data = await exe(sql);
    res.json(data[0]);
});

// Categories routes

router.post("/categories",async (req, res)=>{
    const d=req.body;
    const sql=`insert into categories (name) values (?)`;
    const data=await exe(sql, [d.name]);
     res.json({ message: "Category Added Successfully" });
    res.json(data);
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

router.get("/cars",async (req,res)=>{
    const sql=`select * from cars`;
    const data=await exe(sql);
    res.json(data);
});

router.post("/cars",async (req, res)=>{
    
    var cars_image="";
    if(req.files){
        if(req.files.car_image){
            cars_image=new Date().getTime()+req.files.car_image.name;
            req.files.car_image.mv("public/"+cars_image);
        }
    }
    const d=req.body;
    const sql=`insert into cars (name,brand,cars_image,category_id,price_per_day,is_available) values (?,?,?,?,?)`;
    const data=await exe(sql,[d.name,d.brand,cars_image,d.category_id,d.price_per_day,d.is_available]);
    res.json(data);
});

router.put("/cars/:id", async (req, res) => {

        const id = req.params.id;
        const d = req.body;
        let cars_image = d.cars_image;

        const sql = `UPDATE cars SET name=?,brand=?,cars_image=?, category_id=?, price_per_day=?, is_available=? WHERE id=?`;
        await exe(sql, [d.name,d.brand,cars_image,d.category_id,d.price_per_day,d.is_available,id]);

        res.json({ message: "Car Updated Successfully" });
});

router.delete("/cars/:id", async (req, res) => {
    const id=req.params.id;
    const sql=`delete from cars where id=?`;
    const data=await exe(sql,[id]);
    res.json({message:"Car Deleted Successfully"});
});

router.put("/cars/:id/availability", async (req, res) => {
    const id = req.params.id;
    const d = req.body; 
    const sql = `UPDATE cars SET is_available=? WHERE id=?`;
    await exe(sql, [d.is_available, id]);
    res.json({ message: "Car Availability Updated Successfully" });
});

// Bookings routes
router.get("/bookings",async (req,res)=>{
    const sql=`select b.id,b.pickup_location,b.drop_location,b.start_date,b.end_date,b.total_amount,b.status,u.name as user_name,c.name as car_name from bookings b join users u on b.user_id=u.id join cars c on b.car_id=c.id`;
    const data=await exe(sql);
    const sql1=`update bookings set status="Booked"`;
    await exe(sql1);
    res.json(data);
});

router.put("/bookings/:id/approve", async (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE bookings SET status='approved' WHERE id=?`;
    await exe(sql, [id]);
    res.json({ message: "Booking Approved Successfully" });
});

router.put("/bookings/:id/reject", async (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE bookings SET status='rejected' WHERE id=?`;
    await exe(sql, [id]);
    res.json({ message: "Booking Rejected Successfully" });
});

// Invoice route
router.get("/bookings/:id/invoice",async (req,res)=>{
    const id=req.params.id;
    const sql=`select b.id as booking_id,b.pickup_location,b.drop_location,b.start_date,b.end_date,b.total_amount,b.status,u.name as user_name,u.email as user_email,c.name as car_name,c.cars_image as car_image from bookings b join users u on b.user_id=u.id join cars c on b.car_id=c.id where b.id=?`;
    const data=await exe(sql,[id]);
    res.json(data[0]);
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

// analyze routes

router.get("/analytics", async (req, res) => {
  const sql = `
    SELECT DATE(created_at) as date, COUNT(*) as total
    FROM users
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at)
  `;
  const data = await exe(sql);
  res.json(data);
});

router.get("/dashboard/summary", async (req, res) => {
  const totalCars = await exe("SELECT COUNT(*) as total FROM cars");
  const bookedCars = await exe(
    "SELECT COUNT(DISTINCT car_id) as total FROM bookings WHERE status='booked'"
  );
  const totalUsers = await exe("SELECT COUNT(*) as total FROM users");
  const totalReviews = await exe("SELECT COUNT(*) as total FROM feedbacks");

  res.json({
    totalCars: totalCars[0].total,
    bookedCars: bookedCars[0].total,
    totalUsers: totalUsers[0].total,
    totalReviews: totalReviews[0].total
  });
});




module.exports=router;