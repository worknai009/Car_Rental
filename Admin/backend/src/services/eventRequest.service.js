const { exe } = require("../config/db");

function normalizeStatus(s) {
  const x = String(s || "PENDING").toUpperCase();
  if (["PENDING", "CONFIRMED", "CANCELLED"].includes(x)) return x;
  return "PENDING";
}

function normalizeBilling(x) {
  const b = String(x || "PER_DAY").toUpperCase();
  if (["PER_DAY", "PER_KM", "PACKAGE"].includes(b)) return b;
  return "PER_DAY";
}

async function createEventRequest(payload) {
  const billing_type = normalizeBilling(payload.billing_type);

  // ✅ if PER_KM require distance & coords
  if (billing_type === "PER_KM") {
    const km = Number(payload.distance_km);
    if (!Number.isFinite(km) || km <= 0) throw new Error("distance_km is required for PER_KM");

    if (
      payload.pickup_lat == null ||
      payload.pickup_lng == null ||
      payload.drop_lat == null ||
      payload.drop_lng == null
    ) {
      throw new Error("pickup/drop lat/lng required for PER_KM");
    }
  }

  const result = await exe(
    `INSERT INTO event_requests
     (user_id, event_type, city, start_date, end_date, start_time,
      cars_qty, badge, min_seats, billing_type, distance_km,
      pickup_location, pickup_lat, pickup_lng,
      drop_location, drop_lat, drop_lng,
      phone, note, status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      payload.user_id,
      payload.event_type,
      payload.city,
      payload.start_date,
      payload.end_date,
      payload.start_time,

      payload.cars_qty,
      payload.badge,
      payload.min_seats,

      billing_type,
      payload.distance_km,

      payload.pickup_location,
      payload.pickup_lat,
      payload.pickup_lng,

      payload.drop_location,
      payload.drop_lat,
      payload.drop_lng,

      payload.phone,
      payload.note,
      "PENDING",
    ]
  );

  const id = result?.insertId || result?.[0]?.insertId || null;
  return { id, status: "PENDING" };
}

async function getMyEventRequests(user_id) {
  return exe(
    `SELECT id, event_type, city, start_date, end_date, start_time,
            cars_qty, badge, min_seats, billing_type, distance_km,
            pickup_location, drop_location, phone, note, status, created_at
     FROM event_requests
     WHERE user_id=?
     ORDER BY id DESC`,
    [user_id]
  );
}

async function listEventRequests({ status }) {
  const where = [];
  const params = [];

  if (status) {
    where.push("er.status=?");
    params.push(normalizeStatus(status));
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  // ✅ join users for admin view
  return exe(
    `SELECT
        er.*,
        u.name AS user_name,
        u.email AS user_email
     FROM event_requests er
     LEFT JOIN users u ON u.id = er.user_id
     ${whereSql}
     ORDER BY er.id DESC`,
    params
  );
}

async function getEventRequestById(id) {
  const rows = await exe(
    `SELECT
        er.*,
        u.name AS user_name,
        u.email AS user_email
     FROM event_requests er
     LEFT JOIN users u ON u.id = er.user_id
     WHERE er.id=? LIMIT 1`,
    [id]
  );
  return rows?.[0] || null;
}

async function updateEventRequestStatus(id, status) {
  const st = normalizeStatus(status);

  const rows = await exe(`SELECT id FROM event_requests WHERE id=? LIMIT 1`, [id]);
  if (!rows.length) throw new Error("Request not found");

  await exe(`UPDATE event_requests SET status=? WHERE id=?`, [st, id]);
  return { id, status: st };
}

module.exports = {
  createEventRequest,
  getMyEventRequests,
  listEventRequests,
  getEventRequestById,
  updateEventRequestStatus,
};
