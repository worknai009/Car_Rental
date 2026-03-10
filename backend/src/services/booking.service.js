const { exe } = require("../config/db");

const msDay = 24 * 60 * 60 * 1000;

function calcDays(start_date, end_date) {
  const s = new Date(start_date);
  const e = new Date(end_date);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 1;

  const diff = Math.ceil((e - s) / msDay) + 1; // inclusive
  return diff > 0 ? diff : 1;
}

function normalizeMode(v) {
  const x = String(v || "RENTAL").trim().toUpperCase();
  return x === "TRANSFER" ? "TRANSFER" : "RENTAL";
}

function normalizeBilling(v) {
  const x = String(v || "PER_DAY").trim().toUpperCase();
  return x === "PER_KM" ? "PER_KM" : "PER_DAY";
}

async function getCarById(car_id) {
  const rows = await exe(
    `SELECT id, price_per_day, price_per_km, is_active, is_available
     FROM cars
     WHERE id=? LIMIT 1`,
    [car_id]
  );
  return rows?.[0] || null;
}

async function checkOverlapBooking(car_id, start_date, end_date) {
  const rows = await exe(
    `SELECT id
     FROM bookings
     WHERE car_id=?
       AND LOWER(status) NOT IN ('cancelled', 'cancel_requested')
       AND NOT (end_date < ? OR start_date > ?)
     LIMIT 1`,
    [car_id, start_date, end_date]
  );
  return rows.length > 0;
}

/**
 * ✅ YOUR RULES:
 *
 * Two-way (RENTAL) = charge per day → total = price_per_day × total_days
 * Two-way (RENTAL) = charge per km  → total = price_per_day × total_km
 *
 * One-way (TRANSFER) = charge per day → total = price_per_km × total_days
 * One-way (TRANSFER) = charge per km  → total = price_per_km × total_km
 *
 * distance_km from frontend is ONE-WAY distance.
 * RENTAL will be billed as 2-way => distance*2
 */
async function createBooking({
  user_id,
  car_id,
  pickup_location,
  drop_location,
  start_date,
  end_date,
  booking_mode = "RENTAL",
  start_time = null,

  billing_type = "PER_DAY", // PER_DAY | PER_KM
  distance_km = null,       // one-way from frontend
}) {
  const car = await getCarById(car_id);
  if (!car) throw new Error("Car not found");
  if (Number(car.is_active ?? 1) !== 1) throw new Error("Car is not active");
  if (Number(car.is_available ?? 1) !== 1) throw new Error("Car is not available");

  booking_mode = normalizeMode(booking_mode);
  billing_type = normalizeBilling(billing_type);

  // ✅ TRANSFER must be same day (if that's your business rule)
  if (booking_mode === "TRANSFER") end_date = start_date;

  if (!start_date) throw new Error("start_date is required");
  if (!end_date) throw new Error("end_date is required");

  // ✅ overlap check
  const isOverlap = await checkOverlapBooking(car_id, start_date, end_date);
  if (isOverlap) throw new Error("Car is already booked for selected dates");

  // ✅ days
  const days = booking_mode === "TRANSFER" ? 1 : calcDays(start_date, end_date);

  // ✅ rates (save in DB)
  const rate_per_day = Number(car.price_per_day || 0);
  const rate_per_km = Number(car.price_per_km || 0);

  // ✅ baseRate depends on mode (YOUR RULE)
  const baseRate = booking_mode === "TRANSFER" ? rate_per_km : rate_per_day;

  // ✅ total km
  let billedKm = null;
  if (billing_type === "PER_KM") {
    const km = Number(distance_km);

    if (!Number.isFinite(km) || km <= 0) {
      throw new Error("distance_km is required for PER_KM (must be > 0)");
    }

    billedKm = booking_mode === "RENTAL"
      ? Number((km * 2).toFixed(2))   // 2-way
      : Number(km.toFixed(2));        // 1-way
  }

  // ✅ total amount (YOUR RULE)
  let total_amount = 0;
  if (billing_type === "PER_DAY") {
    total_amount = Number((baseRate * days).toFixed(2));
  } else {
    total_amount = Number((baseRate * billedKm).toFixed(2));
  }



  // ✅ INSERT using your table columns
  const result = await exe(
    `INSERT INTO bookings
      (user_id, car_id, pickup_location, drop_location, start_date, end_date,
       distance_km, rate_per_day, rate_per_km,
       total_amount, status, booking_mode, billing_type, start_time)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      user_id,
      car_id,
      pickup_location,
      drop_location,
      start_date,
      end_date,

      billedKm,        // store billed km (2-way for RENTAL)
      rate_per_day,
      rate_per_km,

      total_amount,
      "BOOKED",
      booking_mode,
      billing_type,
      start_time,
    ]
  );
  

  const booking_id = result?.insertId || result?.[0]?.insertId || null;

  return {
    booking_id,
    days,
    booking_mode,
    billing_type,
    distance_km: billedKm,
    rate_per_day,
    rate_per_km,
    total_amount,
  };
}

async function getMyBookings(user_id) {
  return exe(
    `SELECT 
        b.*,
        c.name AS car_name,
        c.brand AS car_brand,
        c.cars_image AS car_image
     FROM bookings b
     JOIN cars c ON c.id = b.car_id
     WHERE b.user_id=?
     ORDER BY b.id DESC`,
    [user_id]
  );
}

async function cancelBooking(user_id, booking_id) {
  const rows = await exe(`SELECT id, status FROM bookings WHERE id=? AND user_id=? LIMIT 1`, [
    booking_id,
    user_id,
  ]);
  if (!rows.length) throw new Error("Booking not found");

  if (String(rows[0].status || "").toLowerCase() === "cancelled") return { cancelled: true };

  await exe(`UPDATE bookings SET status='CANCELLED' WHERE id=? AND user_id=?`, [
    booking_id,
    user_id,
  ]);
  return { cancelled: true };
}

async function deleteBooking(user_id, booking_id) {
  const rows = await exe(`SELECT id FROM bookings WHERE id=? AND user_id=? LIMIT 1`, [
    booking_id,
    user_id,
  ]);
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
