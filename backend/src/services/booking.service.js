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
  // Any booking that is NOT cancelled overlaps the requested range
  const rows = await exe(
    `SELECT id
     FROM bookings
     WHERE car_id=?
       AND status <> 'cancelled'
       AND NOT (end_date < ? OR start_date > ?)`,
    [car_id, start_date, end_date]
  );
  return rows.length > 0;
}

async function createBooking({ user_id, car_id, pickup_location, drop_location, start_date, end_date }) {
  const car = await getCarById(car_id);
  if (!car) throw new Error("Car not found");
  if (Number(car.is_active ?? 1) !== 1) throw new Error("Car is not active");
  if (Number(car.is_available ?? 1) !== 1) throw new Error("Car is not available");

  const isOverlap = await checkOverlapBooking(car_id, start_date, end_date);
  if (isOverlap) throw new Error("Car is already booked for selected dates");

  const days = calcDays(start_date, end_date);
  const total_amount = Number(car.price_per_day || 0) * days;

  const result = await exe(
    `INSERT INTO bookings (user_id, car_id, pickup_location, drop_location, start_date, end_date, total_amount, status)
     VALUES (?,?,?,?,?,?,?,?)`,
    [user_id, car_id, pickup_location, drop_location, start_date, end_date, total_amount, "confirmed"]
  );

  // your exe() may return insertId or result object depending on db helper
  const booking_id = result?.insertId || result?.[0]?.insertId || null;

  return { booking_id, days, total_amount };
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
  if (rows[0].status === "cancelled") return { cancelled: true };

  await exe(
    `UPDATE bookings SET status='cancelled' WHERE id=? AND user_id=?`,
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

  // Hard delete (simple)
  await exe(`DELETE FROM bookings WHERE id=? AND user_id=?`, [booking_id, user_id]);
  return { deleted: true };
}

async function getInvoice(user_id, booking_id) {
  const rows = await exe(
    `SELECT 
        b.*,
        c.name AS car_name,
        c.brand,
        c.price_per_day,
        c.cars_image
     FROM bookings b
     JOIN cars c ON c.id = b.car_id
     WHERE b.id=? AND b.user_id=?`,
    [booking_id, user_id]
  );

  if (!rows.length) throw new Error("Invoice not found");
  const booking = rows[0];

  // compute days on the fly (since your table has no days column)
  const days = calcDays(booking.start_date, booking.end_date);

  return {
    booking_id: booking.id,
    car: {
      id: booking.car_id,
      name: booking.car_name,
      brand: booking.brand,
      price_per_day: booking.price_per_day,
      cars_image: booking.cars_image,
    },
    trip: {
      pickup_location: booking.pickup_location,
      drop_location: booking.drop_location,
      start_date: booking.start_date,
      end_date: booking.end_date,
      days,
    },
    payment: {
      total_amount: booking.total_amount,
      status: booking.status,
      created_at: booking.created_at,
    },
  };
}

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  deleteBooking,
  getInvoice,
};
