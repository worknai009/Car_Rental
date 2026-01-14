const { exe } = require("../config/db");

function calcDays(start_date, end_date) {
  const s = new Date(start_date);
  const e = new Date(end_date);
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : 1;
}

async function getCarById(car_id) {
  const rows = await exe(
    `SELECT id, price_per_day, is_active, is_available
     FROM cars
     WHERE id=?`,
    [car_id]
  );
  return rows[0] || null;
}

async function checkOverlapBooking(car_id, start_date, end_date) {
  const rows = await exe(
    `SELECT id
     FROM bookings
     WHERE car_id=?
       AND LOWER(status) <> 'cancelled'
       AND NOT (end_date < ? OR start_date > ?)`,
    [car_id, start_date, end_date]
  );
  return rows.length > 0;
}


async function createBooking({
  user_id,
  car_id,
  pickup_location,
  drop_location,
  start_date,
  end_date,
  booking_mode = "RENTAL",
  start_time = null,
}) {
  const car = await getCarById(car_id);
  if (!car) throw new Error("Car not found");
  if (Number(car.is_active ?? 1) !== 1) throw new Error("Car is not active");
  if (Number(car.is_available ?? 1) !== 1) throw new Error("Car is not available");

  booking_mode = String(booking_mode || "RENTAL").toUpperCase();

  // ✅ Force one-way end_date = start_date
  if (booking_mode === "TRANSFER") {
    end_date = start_date;
  }

  const isOverlap = await checkOverlapBooking(car_id, start_date, end_date);
  if (isOverlap) throw new Error("Car is already booked for selected dates");

  // ✅ TRANSFER always 1 day billing
  const days = booking_mode === "TRANSFER" ? 1 : calcDays(start_date, end_date);
  const total_amount = Number(car.price_per_day || 0) * days;

  const result = await exe(
    `INSERT INTO bookings 
      (user_id, car_id, pickup_location, drop_location, start_date, end_date, total_amount, status, booking_mode, start_time)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      user_id,
      car_id,
      pickup_location,
      drop_location,
      start_date,
      end_date,
      total_amount,
      "BOOKED",
      booking_mode,
      start_time,
    ]
  );

  const booking_id = result?.insertId || result?.[0]?.insertId || null;
  return { booking_id, days, total_amount, booking_mode };
}


async function getMyBookings(user_id) {
  const rows = await exe(
    `SELECT 
        b.*,
        c.name AS car_name,
        c.brand,
        c.cars_image,
        c.city,
        c.year,
        c.seats,
        c.fuel_type,
        c.price_per_day
     FROM bookings b
     JOIN cars c ON c.id = b.car_id
     WHERE b.user_id=?
     ORDER BY b.id DESC`,
    [user_id]
  );
  return rows;
}

async function cancelBooking(user_id, booking_id) {
  const rows = await exe(
    `SELECT id, status FROM bookings WHERE id=? AND user_id=?`,
    [booking_id, user_id]
  );
  if (!rows.length) throw new Error("Booking not found");

  if (String(rows[0].status || "").toLowerCase() === "cancelled") return { cancelled: true };

  await exe(
    `UPDATE bookings SET status='CANCELLED' WHERE id=? AND user_id=?`,
    [booking_id, user_id]
  );

  return { cancelled: true };
}

async function deleteBooking(user_id, booking_id) {
  const rows = await exe(
    `SELECT id FROM bookings WHERE id=? AND user_id=?`,
    [booking_id, user_id]
  );
  if (!rows.length) throw new Error("Booking not found");

  await exe(`DELETE FROM bookings WHERE id=? AND user_id=?`, [booking_id, user_id]);
  return { deleted: true };
}

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  deleteBooking,
};
