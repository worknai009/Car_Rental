// src/pages/EventsPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  Phone,
  Car,
  Users,
  ClipboardList,
  Loader2,
} from "lucide-react";
import userApi from "../utils/userApi";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// ✅ Haversine KM (straight-line) – no extra API cost
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

// ✅ Google Places input (fixes “one letter then stops” issues by keeping input controlled)
const PlacesInput = ({
  isLoaded,
  value,
  onChange,
  onSelect,
  placeholder,
  disabled,
}) => {
  const acRef = useRef(null);

  // fallback if google not loaded
  if (!isLoaded) {
    return (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none disabled:opacity-60"
        autoComplete="off"
      />
    );
  }

  return (
    <Autocomplete
      onLoad={(ac) => (acRef.current = ac)}
      onPlaceChanged={() => {
        const place = acRef.current?.getPlace?.();

        const address =
          place?.formatted_address ||
          place?.name ||
          place?.vicinity ||
          value ||
          "";

        const lat = place?.geometry?.location?.lat?.();
        const lng = place?.geometry?.location?.lng?.();

        // set text
        onChange(address);

        // save coords
        onSelect?.({ address, lat, lng });
      }}
      options={{
        // componentRestrictions: { country: "in" },
        fields: ["formatted_address", "name", "geometry.location", "vicinity"],
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none disabled:opacity-60"
        autoComplete="off"
      />
    </Autocomplete>
  );
};

const todayYYYYMMDD = () => new Date().toISOString().split("T")[0];

const statusPill = (status) => {
  const s = String(status || "PENDING").toUpperCase();
  if (s === "CONFIRMED") return "bg-green-100 text-green-700";
  if (s === "CANCELLED") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
};

export default function EventsPage() {
  const navigate = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "",
    libraries,
  });

  const [form, setForm] = useState({
    event_type: "WEDDING", // WEDDING/CORPORATE/TOUR/PARTY/OTHER
    start_date: "",
    end_date: "",
    start_time: "",
    city: "",

    cars_qty: 1,
    badge: "ANY", // ANY/PLATINUM/GOLD/SILVER
    min_seats: 4,

    billing_type: "PER_DAY", // PER_DAY / PER_KM / PACKAGE
    distance_km: "",

    pickup_location: "",
    drop_location: "",

    phone: "",
    note: "",
  });

  const [coords, setCoords] = useState({
    pickup: { lat: null, lng: null },
    drop: { lat: null, lng: null },
  });

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // ✅ NEW: my bookings state
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingMyBookings, setLoadingMyBookings] = useState(false);

  // ✅ auto km if PER_KM and coords available
  const autoKm = useMemo(() => {
    if (form.billing_type !== "PER_KM") return null;
    return haversineKm(coords.pickup, coords.drop);
  }, [coords, form.billing_type]);

  useEffect(() => {
    if (form.billing_type === "PER_KM" && autoKm) {
      setForm((p) => ({ ...p, distance_km: String(autoKm) }));
    }
  }, [autoKm, form.billing_type]);

  // when billing is not PER_KM, make drop optional + clear coords safely
  useEffect(() => {
    if (form.billing_type !== "PER_KM") {
      setForm((p) => ({ ...p, distance_km: "" }));
      setCoords((p) => ({ ...p, drop: { lat: null, lng: null } }));
    }
  }, [form.billing_type]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const token = localStorage.getItem("token");
    if (!token) return "Please login first";

    if (!form.event_type) return "Select event type";
    if (!form.city.trim()) return "City is required";
    if (!form.start_date) return "Start date is required";
    if (!form.end_date) return "End date is required";
    if (!form.start_time) return "Start time is required";

    const sd = new Date(form.start_date);
    const ed = new Date(form.end_date);
    if (Number.isNaN(sd.getTime()) || Number.isNaN(ed.getTime())) return "Invalid dates";
    if (ed < sd) return "End date must be after start date";

    const carsQty = Number(form.cars_qty);
    if (!Number.isFinite(carsQty) || carsQty < 1) return "Cars needed must be >= 1";

    const minSeats = Number(form.min_seats);
    if (!Number.isFinite(minSeats) || minSeats < 2) return "Min seats must be >= 2";

    if (!form.pickup_location.trim()) return "Pickup location is required";

    const phone = String(form.phone || "").trim();
    if (!phone) return "Phone is required";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) return "Phone number must be at least 10 digits";

    if (form.billing_type === "PER_KM") {
      if (!coords.pickup.lat || !coords.pickup.lng || !coords.drop.lat || !coords.drop.lng) {
        return "Select Pickup & Drop from Google suggestions (click a suggestion) to get lat/lng";
      }
      const km = toNum(form.distance_km);
      if (!km || km <= 0) return "Distance KM is required for PER_KM";
    }

    return null;
  };

  // ✅ NEW: fetch my event bookings
  const fetchMyBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      setLoadingMyBookings(true);
      const res = await userApi.get("/event-requests/my-requests");
      setMyBookings(Array.isArray(res.data) ? res.data : []);
      setShowMyBookings(true);
    } catch (e) {
      console.error("Fetch my bookings error:", e);
      alert(e?.response?.data?.message || "Failed to load my bookings");
    } finally {
      setLoadingMyBookings(false);
    }
  };

  const submit = async () => {
    setApiError("");
    const err = validate();
    if (err) {
      if (err === "Please login first") {
        alert(err);
        navigate("/login");
        return;
      }
      alert(err);
      return;
    }

    const payload = {
      event_type: String(form.event_type || "OTHER").toUpperCase(),

      start_date: form.start_date,
      end_date: form.end_date,
      start_time: form.start_time,

      city: form.city,

      cars_qty: Number(form.cars_qty),
      badge: String(form.badge || "ANY").toUpperCase(),
      min_seats: Number(form.min_seats),

      billing_type: String(form.billing_type || "PER_DAY").toUpperCase(),
      distance_km: form.billing_type === "PER_KM" ? Number(form.distance_km) : null,

      pickup_location: form.pickup_location,
      pickup_lat: coords.pickup.lat,
      pickup_lng: coords.pickup.lng,

      drop_location: form.billing_type === "PER_KM" ? form.drop_location : null,
      drop_lat: form.billing_type === "PER_KM" ? coords.drop.lat : null,
      drop_lng: form.billing_type === "PER_KM" ? coords.drop.lng : null,

      phone: String(form.phone || "").trim(),
      note: form.note?.trim() ? form.note.trim() : null,
    };

    try {
      setSubmitting(true);

      const res = await userApi.post("/event-requests/request", payload);

      alert(res?.data?.message || "Event request submitted ✅");

      // optional reset
      setForm({
        event_type: "WEDDING",
        start_date: "",
        end_date: "",
        start_time: "",
        city: "",
        cars_qty: 1,
        badge: "ANY",
        min_seats: 4,
        billing_type: "PER_DAY",
        distance_km: "",
        pickup_location: "",
        drop_location: "",
        phone: "",
        note: "",
      });
      setCoords({
        pickup: { lat: null, lng: null },
        drop: { lat: null, lng: null },
      });

      // ✅ refresh history after submit
      fetchMyBookings();

      navigate("/");
    } catch (e) {
      console.error("Event request submit error:", e);

      const msg =
        e?.response?.data?.message ||
        (Array.isArray(e?.response?.data?.errors) ? "Validation failed" : "") ||
        "Submit failed";

      setApiError(
        Array.isArray(e?.response?.data?.errors)
          ? `${msg}: ${e.response.data.errors?.[0]?.msg || ""}`
          : msg
      );

      alert(
        Array.isArray(e?.response?.data?.errors)
          ? `${msg}\n${(e.response.data.errors || [])
              .map((x) => `• ${x.msg}`)
              .join("\n")}`
          : msg
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow border p-6 space-y-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-cyan-600" />
          <h1 className="text-2xl font-black text-gray-900">Book Cars for Event</h1>
        </div>

        {apiError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 font-semibold">
            {apiError}
          </div>
        ) : null}

        {/* ✅ NEW BUTTON (ONLY ADDED THIS) */}
        <button
          onClick={fetchMyBookings}
          disabled={loadingMyBookings}
          className="w-full py-3 rounded-2xl border border-gray-200 bg-white font-bold hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-60"
          type="button"
        >
          {loadingMyBookings ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading My Bookings...
            </>
          ) : (
            <>
              <CalendarDays className="w-5 h-5" />
              Show My Event Bookings
            </>
          )}
        </button>

        {/* ✅ NEW: HISTORY SECTION */}
        {showMyBookings ? (
          <div className="rounded-3xl border bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-black text-gray-900">My Event Bookings</div>
              <button
                onClick={() => setShowMyBookings(false)}
                className="text-sm font-bold text-gray-600 hover:text-black"
                type="button"
              >
                Hide
              </button>
            </div>

            {myBookings.length === 0 ? (
              <div className="text-sm text-gray-600">No bookings found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white text-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-left">ID</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">City</th>
                      <th className="px-3 py-2 text-left">Dates</th>
                      <th className="px-3 py-2 text-left">Cars</th>
                      <th className="px-3 py-2 text-left">Billing</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBookings.slice(0, 20).map((b) => (
                      <tr key={b.id} className="border-t bg-white">
                        <td className="px-3 py-2 font-semibold">#{b.id}</td>
                        <td className="px-3 py-2">{b.event_type || "-"}</td>
                        <td className="px-3 py-2">{b.city || "-"}</td>
                        <td className="px-3 py-2">
                          {b.start_date ? `${b.start_date} → ${b.end_date || b.start_date}` : "-"}
                        </td>
                        <td className="px-3 py-2">
                          {b.cars_qty || "-"}{" "}
                          <span className="text-xs text-gray-400">
                            ({b.badge || "ANY"} / min {b.min_seats || "-"})
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {b.billing_type || "-"}
                          {String(b.billing_type || "").toUpperCase() === "PER_KM" ? (
                            <span className="text-xs text-gray-500"> • {b.distance_km || "-"} km</span>
                          ) : null}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${statusPill(
                              b.status
                            )}`}
                          >
                            {b.status || "PENDING"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}

        {/* Event Type */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Event Type</label>
          <select
            name="event_type"
            value={form.event_type}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none"
          >
            <option value="WEDDING">Wedding</option>
            <option value="CORPORATE">Corporate</option>
            <option value="TOUR">Tour</option>
            <option value="PARTY">Party</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={onChange}
              min={todayYYYYMMDD()}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={onChange}
              min={form.start_date || todayYYYYMMDD()}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Start Time</label>
            <input
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
          <input
            name="city"
            value={form.city}
            onChange={onChange}
            placeholder="Pune / Mumbai..."
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none"
          />
        </div>

        {/* Cars qty + badge + min seats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <Car className="inline w-4 h-4 mr-1" /> Cars Needed
            </label>
            <input
              type="number"
              min={1}
              name="cars_qty"
              value={form.cars_qty}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Car Type / Badge</label>
            <select
              name="badge"
              value={form.badge}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none"
            >
              <option value="ANY">Any</option>
              <option value="PLATINUM">Platinum</option>
              <option value="GOLD">Gold</option>
              <option value="SILVER">Silver</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <Users className="inline w-4 h-4 mr-1" /> Min Seats
            </label>
            <input
              type="number"
              min={2}
              name="min_seats"
              value={form.min_seats}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none"
            />
          </div>
        </div>

        {/* Billing */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Billing Type</label>
          <select
            name="billing_type"
            value={form.billing_type}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none"
          >
            <option value="PER_DAY">Per Day</option>
            <option value="PER_KM">Per KM</option>
            <option value="PACKAGE">Package</option>
          </select>
        </div>

        {/* Pickup + Drop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" /> Pickup Location
            </label>
            <PlacesInput
              isLoaded={isLoaded}
              value={form.pickup_location}
              onChange={(v) => {
                setForm((p) => ({ ...p, pickup_location: v }));
                setCoords((p) => ({ ...p, pickup: { lat: null, lng: null } }));
              }}
              onSelect={({ lat, lng }) =>
                setCoords((p) => ({
                  ...p,
                  pickup: { lat: lat ?? null, lng: lng ?? null },
                }))
              }
              placeholder="Pickup location"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" /> Drop Location{" "}
              {form.billing_type !== "PER_KM" ? (
                <span className="text-xs text-gray-400">(optional)</span>
              ) : null}
            </label>

            <PlacesInput
              isLoaded={isLoaded}
              value={form.drop_location}
              onChange={(v) => {
                setForm((p) => ({ ...p, drop_location: v }));
                setCoords((p) => ({ ...p, drop: { lat: null, lng: null } }));
              }}
              onSelect={({ lat, lng }) =>
                setCoords((p) => ({
                  ...p,
                  drop: { lat: lat ?? null, lng: lng ?? null },
                }))
              }
              placeholder={
                form.billing_type === "PER_KM"
                  ? "Drop location"
                  : "Drop not required (Per Day / Package)"
              }
            />
          </div>
        </div>

        {/* KM */}
        {form.billing_type === "PER_KM" ? (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Distance (KM)</label>
            <input
              name="distance_km"
              value={form.distance_km}
              onChange={onChange}
              placeholder="Auto-filled if pickup/drop selected"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none"
            />
          </div>
        ) : null}

        {/* Phone */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            <Phone className="inline w-4 h-4 mr-1" /> Phone
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="Enter phone number"
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Note (optional)</label>
          <textarea
            name="note"
            value={form.note}
            onChange={onChange}
            placeholder="Any special requirement..."
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white outline-none min-h-[100px]"
          />
        </div>

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-black shadow-lg hover:shadow-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          type="button"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CalendarDays className="w-5 h-5" />
              Submit Event Booking Request
            </>
          )}
        </button>

       
      </div>
    </div>
  );
}
