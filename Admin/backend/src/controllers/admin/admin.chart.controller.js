const { exe } = require("../../config/db");

// PIE: cars count by category
exports.pieCategoryCars = async (req, res) => {
  try {
    const rows = await exe(`
      SELECT 
        cat.name AS category,
        COUNT(c.id) AS total
      FROM categories cat
      LEFT JOIN cars c ON c.category_id = cat.id
      WHERE cat.is_active = 1
      GROUP BY cat.id, cat.name
      ORDER BY cat.name ASC
    `);

    // Nivo Pie format
    const data = rows.map((r) => ({
      id: r.category,
      label: r.category,
      value: Number(r.total),
    }));

    res.json(data);
  } catch (err) {
    console.error("PIE API ERROR:", err);
    res.status(500).json({ message: "Pie chart error" });
  }
};


// BAR: monthly revenue by category (Nivo format)
exports.barRevenueByCategory = async (req, res) => {
  try {
    const rows = await exe(`
      SELECT 
        DATE_FORMAT(b.start_date, '%b') AS month,
        cat.name AS category,
        SUM(b.total_amount) AS revenue,
        MIN(b.start_date) AS sort_date
      FROM bookings b
      JOIN cars car ON b.car_id = car.id
      JOIN categories cat ON car.category_id = cat.id
      GROUP BY month, category
      ORDER BY sort_date ASC
    `);

    // Convert SQL -> Nivo Bar format
    const monthMap = {};
    const keysSet = new Set();

    rows.forEach((r) => {
      const month = r.month;
      const category = r.category;
      const revenue = Number(r.revenue || 0);

      keysSet.add(category);

      if (!monthMap[month]) {
        monthMap[month] = { month };
      }

      monthMap[month][category] = revenue;
    });

    res.json({
      data: Object.values(monthMap),
      keys: Array.from(keysSet),
    });
  } catch (err) {
    console.error("BAR API ERROR:", err);
    res.status(500).json({ message: "Bar chart error" });
  }
};
