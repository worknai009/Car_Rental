const { exe } = require("../../config/db"); // ✅ adjust if your db.js path differs

// ✅ GET /admin/dashboard
exports.dashboard = async (req, res) => {
  try {
    // Monthly revenue (current month)
    const revenueRows = await exe(`
      SELECT IFNULL(SUM(total_amount), 0) AS total
      FROM bookings
      WHERE status = 'COMPLETED'
        AND MONTH(created_at) = MONTH(CURDATE())
        AND YEAR(created_at) = YEAR(CURDATE())
    `);

    const bookingsRows = await exe(`
      SELECT COUNT(*) AS total
      FROM bookings
      WHERE MONTH(created_at) = MONTH(CURDATE())
        AND YEAR(created_at) = YEAR(CURDATE())
    `);

    const carRegisterUsersRows = await exe(`
      SELECT COUNT(*) AS total 
      FROM car_register_users
      WHERE MONTH(created_at) = MONTH(CURDATE())
        AND YEAR(created_at) = YEAR(CURDATE())
    `);



    const usersRows = await exe(`SELECT COUNT(*) AS total FROM users`);
    const carsRows = await exe(`SELECT COUNT(*) AS total FROM cars`);

    // ✅ TOUR STATS
    const toursCountRows = await exe(`SELECT COUNT(*) AS total FROM tours_packages`);
    const tourBookingsCountRows = await exe(`SELECT COUNT(*) AS total FROM tour_bookings`);
    const pendingToursCountRows = await exe(`SELECT COUNT(*) AS total FROM tours_packages WHERE status = 'PENDING'`);

    res.json({
      totalRevenue: revenueRows[0]?.total || 0,
      bookingCount: bookingsRows[0]?.total || 0,
      activeClients: usersRows[0]?.total || 0,
      fleetMileage: carsRows[0]?.total || 0, 
      carRegisterUsers: carRegisterUsersRows[0]?.total || 0,
      // TOUR STATS
      totalTours: toursCountRows[0]?.total || 0,
      tourBookings: tourBookingsCountRows[0]?.total || 0,
      pendingTours: pendingToursCountRows[0]?.total || 0
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Dashboard error" });
  }
};

// ✅ GET /admin/dashboard/revenue
exports.revenueReport = async (req, res) => {
  try {
    const rows = await exe(`
      SELECT IFNULL(SUM(total_amount), 0) AS total_revenue
      FROM bookings
      WHERE status = 'COMPLETED'
    `);

    res.json(rows[0]);
  } catch (err) {
    console.error("REVENUE ERROR:", err);
    res.status(500).json({ message: "Revenue report error" });
  }
};

// ✅ GET /admin/dashboard/bar (Nivo bar)
exports.barChart = async (req, res) => {
  try {
    const rows = await exe(`
      SELECT 
        DATE_FORMAT(b.created_at, '%b') AS month,
        cat.name AS category,
        SUM(b.total_amount) AS revenue
      FROM bookings b
      JOIN cars car ON b.car_id = car.id
      JOIN categories cat ON car.category_id = cat.id
      WHERE b.status NOT IN ('CANCELLED', 'CANCEL_REQUESTED')
      GROUP BY month, category
      ORDER BY MIN(b.created_at)
    `);

    const chartMap = {};
    const keysSet = new Set();

    rows.forEach((r) => {
      keysSet.add(r.category);
      if (!chartMap[r.month]) chartMap[r.month] = { month: r.month };
      chartMap[r.month][r.category] = Number(r.revenue);
    });

    res.json({
      data: Object.values(chartMap),
      keys: Array.from(keysSet),
    });
  } catch (err) {
    console.error("BAR CHART ERROR:", err);
    res.status(500).json({ message: "Bar chart error" });
  }
};

// ✅ GET /admin/dashboard/pie (Nivo pie)
exports.pieChart = async (req, res) => {
  try {
    const rows = await exe(`
      SELECT 
        c.name AS category,
        COUNT(car.id) AS total
      FROM categories c
      LEFT JOIN cars car ON car.category_id = c.id
      GROUP BY c.id, c.name
    `);

    const formatted = rows.map((item) => ({
      id: item.category,
      label: item.category,
      value: Number(item.total),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("PIE CHART ERROR:", err);
    res.status(500).json({ message: "Pie chart error" });
  }
};





