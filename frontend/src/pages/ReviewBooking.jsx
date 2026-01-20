import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import userApi from "../utils/userApi";
import { Car, MapPin, Calendar, ArrowRight, Loader2 } from "lucide-react";

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// ✅ Haversine distance (straight-line). Works without extra API.
function haversineKm(a, b) {
  if (!a?.lat || !a?.lng || !b?.lat || !b?.lng) return null;
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return Number((R * c).toFixed(2));
}

const ReviewBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const carId = searchParams.get("car_id");

  const bookingModeFromUrl = (searchParams.get("booking_mode") || "RENTAL").toUpperCase();
  const billingTypeFromUrl = (searchParams.get("billing_type") || "PER_DAY").toUpperCase();

  const pickupFromUrl = searchParams.get("pickup_location") || "";
  const dropFromUrl = searchParams.get("drop_location") || "";
  const startDateFromUrl = searchParams.get("start_date") || "";
  const startTimeFromUrl = searchParams.get("start_time") || "";
  const endDateFromUrl = searchParams.get("end_date") || "";

  const pickupLatUrl = toNum(searchParams.get("pickup_lat"));
  const pickupLngUrl = toNum(searchParams.get("pickup_lng"));
  const dropLatUrl = toNum(searchParams.get("drop_lat"));
  const dropLngUrl = toNum(searchParams.get("drop_lng"));

  const carFromState = location.state?.car || null;

  const [car, setCar] = useState(carFromState);
  const [loadingCar, setLoadingCar] = useState(!carFromState);
  const [saving, setSaving] = useState(false);

  const [coords, setCoords] = useState({
    pickup: { lat: pickupLatUrl, lng: pickupLngUrl },
    drop: { lat: dropLatUrl, lng: dropLngUrl },
  });

  const [form, setForm] = useState({
    booking_mode: bookingModeFromUrl,
    billing_type: billingTypeFromUrl,
    start_time: startTimeFromUrl,
    pickup_location: pickupFromUrl,
    drop_location: dropFromUrl,
    start_date: startDateFromUrl,
    end_date: bookingModeFromUrl === "TRANSFER" ? startDateFromUrl : endDateFromUrl,
  });

  // Sync when URL changes
  useEffect(() => {
    setForm({
      booking_mode: bookingModeFromUrl,
      billing_type: billingTypeFromUrl,
      start_time: startTimeFromUrl,
      pickup_location: pickupFromUrl,
      drop_location: dropFromUrl,
      start_date: startDateFromUrl,
      end_date: bookingModeFromUrl === "TRANSFER" ? startDateFromUrl : endDateFromUrl,
    });

    setCoords({
      pickup: { lat: pickupLatUrl, lng: pickupLngUrl },
      drop: { lat: dropLatUrl, lng: dropLngUrl },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // fallback: load coords from localStorage tripSearch
  useEffect(() => {
    const saved = localStorage.getItem("tripSearch");
    if (!saved) return;
    try {
      const t = JSON.parse(saved);
      if (coords.pickup.lat && coords.drop.lat) return;

      setCoords((p) => ({
        pickup: {
          lat: p.pickup.lat ?? toNum(t.pickup_lat),
          lng: p.pickup.lng ?? toNum(t.pickup_lng),
        },
        drop: {
          lat: p.drop.lat ?? toNum(t.drop_lat),
          lng: p.drop.lng ?? toNum(t.drop_lng),
        },
      }));

      // also bring billing_type if missing
      if (!form.billing_type && t.billing_type) {
        setForm((x) => ({ ...x, billing_type: String(t.billing_type).toUpperCase() }));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchCar = async () => {
      if (carFromState) return;
      if (!carId) return;

      try {
        setLoadingCar(true);
        const res = await userApi.get(`/cars/${carId}`);
        setCar(res.data || null);
      } catch (err) {
        console.error("Fetch car by id error:", err);
        setCar(null);
      } finally {
        setLoadingCar(false);
      }
    };

    fetchCar();
  }, [carId, carFromState]);

  useEffect(() => {
    if (!carId) navigate("/cars", { replace: true });
  }, [carId, navigate]);

  const days = useMemo(() => {
    if (form.booking_mode === "TRANSFER") return 1;
    if (!form.start_date || !form.end_date) return 1;

    const s = new Date(form.start_date);
    const e = new Date(form.end_date);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  }, [form.start_date, form.end_date, form.booking_mode]);

  // ✅ one-way distance (km)
  const oneWayKm = useMemo(() => haversineKm(coords.pickup, coords.drop), [coords]);

  // ✅ total km used for billing (RENTAL = 2-way)
  const billedKm = useMemo(() => {
    if (!oneWayKm) return null;
    return form.booking_mode === "RENTAL" ? Number((oneWayKm * 2).toFixed(2)) : oneWayKm;
  }, [oneWayKm, form.booking_mode]);

  // ✅ base rate as YOUR RULE:
  // RENTAL => use price_per_day
  // TRANSFER => use price_per_km
  const baseRate = useMemo(() => {
    if (!car) return 0;
    return form.booking_mode === "TRANSFER"
      ? Number(car.price_per_km || 0)
      : Number(car.price_per_day || 0);
  }, [car, form.booking_mode]);

  // ✅ total as YOUR RULE
  const total = useMemo(() => {
    if (form.billing_type === "PER_DAY") {
      return Number((baseRate * days).toFixed(2));
    }
    // PER_KM
    if (!billedKm) return 0;
    return Number((baseRate * billedKm).toFixed(2));
  }, [form.billing_type, baseRate, days, billedKm]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((p) => {
      const next = { ...p, [name]: value };

      if (next.booking_mode === "TRANSFER") {
        next.end_date = next.start_date; // lock end date
      }

      return next;
    });
  };

  const handleConfirmBooking = async () => {
    if (!carId) return alert("Car ID missing!");

    if (!form.pickup_location || !form.drop_location || !form.start_date) {
      return alert("Please fill booking details.");
    }

    if (form.booking_mode === "RENTAL" && !form.end_date) {
      return alert("Please select end date.");
    }

    // ✅ if PER_KM we must have distance
    if (form.billing_type === "PER_KM") {
      if (!oneWayKm || oneWayKm <= 0) {
        return alert("KM not found. Please go back and select pickup & drop from Google suggestions.");
      }
    }

    try {
      setSaving(true);

      const payload = {
        car_id: Number(carId),
        pickup_location: form.pickup_location,
        drop_location: form.drop_location,
        start_date: form.start_date,
        end_date: form.booking_mode === "TRANSFER" ? form.start_date : form.end_date,
        booking_mode: form.booking_mode,
        start_time: form.start_time || null,

        // ✅ NEW
        billing_type: form.billing_type,
        distance_km: form.billing_type === "PER_KM" ? oneWayKm : null, // ✅ one-way only
      };

      const res = await userApi.post("/bookings/booking", payload);

      alert(`Booking Created ✅\nBooking ID: ${res.data?.booking_id || ""}`);
      navigate("/my-bookings");
    } catch (err) {
      console.error("Create booking error:", err);
      alert(err?.response?.data?.message || "Booking failed");
    } finally {
      setSaving(false);
    }
  };

  if (loadingCar) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-3 text-gray-700">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading car details...
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-6 rounded-2xl shadow max-w-md w-full text-center">
          <h2 className="text-xl font-black text-gray-900 mb-2">Car not found</h2>
          <p className="text-gray-600 mb-4">This car may be removed or the URL is invalid.</p>
          <button
            onClick={() => navigate("/cars")}
            className="px-6 py-3 rounded-xl bg-gray-900 text-white font-bold"
          >
            Back to Cars
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = car?.cars_image ? `http://localhost:1000/public/${car.cars_image}` : "";

  const rateLabel =
    form.booking_mode === "TRANSFER" ? "Rate (uses price_per_km)" : "Rate (uses price_per_day)";

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="bg-white rounded-3xl shadow border overflow-hidden">
          <div className="h-60 bg-gray-100">
            {imageUrl ? (
              <img src={imageUrl} alt={car.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{car.city || "-"}</span>
            </div>

            <h1 className="text-2xl font-black text-gray-900">{car.name}</h1>
            <p className="text-gray-600">
              {car.brand} • {car.category_name || "Category"}
            </p>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <div className="text-xs text-gray-500 font-semibold">{rateLabel}</div>
                <div className="text-2xl font-black text-gray-900">₹{Number(baseRate).toLocaleString()}</div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500 font-semibold">Trip days</div>
                <div className="text-2xl font-black text-gray-900">{days}</div>
              </div>
            </div>

            {form.billing_type === "PER_KM" ? (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">Distance (billed)</div>
                <div className="text-lg font-black text-gray-900">
                  {billedKm ? `${billedKm} km` : "—"}
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">Estimated Total</div>
              <div className="text-2xl font-black text-gray-900">
                ₹{Number(total || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-3xl shadow border p-6 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Car className="w-6 h-6 text-cyan-600" />
              <h2 className="text-2xl font-black text-gray-900">Review Booking</h2>
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-gray-100">
              {form.booking_mode}
            </span>
          </div>

          {/* ✅ Billing Type selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Billing Type</label>
            <select
              name="billing_type"
              value={form.billing_type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none"
            >
              <option value="PER_DAY">Per Day</option>
              <option value="PER_KM">Per KM</option>
            </select>
            {form.billing_type === "PER_KM" && !oneWayKm ? (
              <p className="mt-2 text-xs text-red-600 font-semibold">
                KM not available. Go back and select locations from Google suggestions.
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pickup Location</label>
              <input
                name="pickup_location"
                value={form.pickup_location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Drop Location</label>
              <input
                name="drop_location"
                value={form.drop_location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={form.booking_mode === "TRANSFER" ? form.start_date : form.end_date}
                  onChange={handleChange}
                  disabled={form.booking_mode === "TRANSFER"}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none disabled:opacity-60"
                />
              </div>
            </div>

            {form.start_time ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                Start Time: <span className="font-bold text-gray-900">{form.start_time}</span>
              </div>
            ) : null}
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={saving || (form.billing_type === "PER_KM" && !oneWayKm)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-black shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Booking...
              </>
            ) : (
              <>
                Confirm Booking <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewBookingPage;
