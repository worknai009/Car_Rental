import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import userApi from "../utils/userApi";
import {
  ArrowLeft,
  MapPin,
  Fuel,
  Users,
  Calendar,
  Star,
  BadgeCheck,
  IndianRupee,
  CheckCircle2,
  Shield,
  Clock,
  MessageSquare,
} from "lucide-react";

const toNumOrNull = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const normalizeMode = (m) => (String(m || "RENTAL").toUpperCase() === "TRANSFER" ? "TRANSFER" : "RENTAL");
const normalizeBilling = (b, mode) => {
  const x = String(b || "").toUpperCase();
  if (x === "PER_KM" || x === "PER_DAY") return x;
  return mode === "TRANSFER" ? "PER_KM" : "PER_DAY";
};

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingCar, setLoadingCar] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState("");

  // ✅ Trip from URL or localStorage (now includes billing + coords)
  const trip = useMemo(() => {
    const qs = new URLSearchParams(location.search);

    const mode = normalizeMode(qs.get("booking_mode") || "");
    const start_date = qs.get("start_date") || "";

    const t = {
      booking_mode: mode,
      billing_type: normalizeBilling(qs.get("billing_type"), mode),

      pickup_location: qs.get("pickup_location") || "",
      drop_location: qs.get("drop_location") || "",
      start_date,
      start_time: qs.get("start_time") || "",
      end_date: mode === "TRANSFER" ? start_date : (qs.get("end_date") || ""),

      pickup_lat: toNumOrNull(qs.get("pickup_lat")),
      pickup_lng: toNumOrNull(qs.get("pickup_lng")),
      drop_lat: toNumOrNull(qs.get("drop_lat")),
      drop_lng: toNumOrNull(qs.get("drop_lng")),
    };

    const hasUrlTrip = t.pickup_location && t.drop_location && t.start_date;
    if (hasUrlTrip) {
      localStorage.setItem("tripSearch", JSON.stringify(t));
      return t;
    }

    const saved = localStorage.getItem("tripSearch");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedMode = normalizeMode(parsed.booking_mode);
        const savedStart = parsed.start_date || "";
        return {
          booking_mode: savedMode,
          billing_type: normalizeBilling(parsed.billing_type, savedMode),

          pickup_location: parsed.pickup_location || "",
          drop_location: parsed.drop_location || "",
          start_date: savedStart,
          start_time: parsed.start_time || "",
          end_date: savedMode === "TRANSFER" ? savedStart : (parsed.end_date || ""),

          pickup_lat: toNumOrNull(parsed.pickup_lat),
          pickup_lng: toNumOrNull(parsed.pickup_lng),
          drop_lat: toNumOrNull(parsed.drop_lat),
          drop_lng: toNumOrNull(parsed.drop_lng),
        };
      } catch {
        return { ...t, booking_mode: "RENTAL", billing_type: "PER_DAY" };
      }
    }

    return { ...t, booking_mode: "RENTAL", billing_type: "PER_DAY" };
  }, [location.search]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoadingCar(true);
        setError("");
        const res = await userApi.get(`/cars/${id}`);
        setCar(res.data || null);
      } catch (err) {
        console.error("Car details error:", err);
        setError(err?.response?.data?.message || "Failed to load car details");
        setCar(null);
      } finally {
        setLoadingCar(false);
      }
    };
    fetchCar();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const res = await userApi.get(`/cars/${id}/reviews`);
        setReviews(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Car reviews error:", err);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [id]);

  const imageUrl = useMemo(() => {
    if (!car?.cars_image) return "";
    return `http://localhost:1000/public/${car.cars_image}`;
  }, [car]);

  const handleBookNow = () => {
    const mode = normalizeMode(trip.booking_mode);
    const billing = normalizeBilling(trip.billing_type, mode);

    // ✅ if PER_KM must have coords
    if (billing === "PER_KM") {
      if (!trip.pickup_lat || !trip.pickup_lng || !trip.drop_lat || !trip.drop_lng) {
        alert("For PER_KM, please select Pickup & Drop from Google suggestions ✅");
        navigate("/");
        return;
      }
    }

    const qs = new URLSearchParams();
    qs.set("car_id", String(car?.id || id));
    qs.set("pickup_location", trip.pickup_location || "");
    qs.set("drop_location", trip.drop_location || "");
    qs.set("start_date", trip.start_date || "");
    qs.set("start_time", trip.start_time || "");
    qs.set("booking_mode", mode);
    qs.set("billing_type", billing);

    qs.set("end_date", mode === "TRANSFER" ? (trip.start_date || "") : (trip.end_date || ""));

    if (trip.pickup_lat != null) qs.set("pickup_lat", String(trip.pickup_lat));
    if (trip.pickup_lng != null) qs.set("pickup_lng", String(trip.pickup_lng));
    if (trip.drop_lat != null) qs.set("drop_lat", String(trip.drop_lat));
    if (trip.drop_lng != null) qs.set("drop_lng", String(trip.drop_lng));

    navigate(`/review-booking?${qs.toString()}`, { state: { car } });
  };

  if (loadingCar) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6">
          Loading car details...
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold"
            >
              Back
            </button>
            <h1 className="text-xl font-black text-gray-900">Car Details</h1>
          </div>
          <p className="text-red-600 font-semibold">{error || "Car not found"}</p>
        </div>
      </div>
    );
  }

  const rating = Number(car.rating || 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border shadow-sm hover:shadow transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {car.badge ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-600 text-white font-bold shadow">
              <BadgeCheck className="w-4 h-4" />
              {car.badge}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow overflow-hidden border">
              <div className="w-full h-[320px] bg-gray-100">
                {imageUrl ? (
                  <img src={imageUrl} alt={car.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900">{car.name}</h1>
                    <p className="text-gray-600 mt-1">
                      {car.brand} • {car.category_name || "Category"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-xl">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-black text-gray-900">{rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <Spec icon={MapPin} label="City" value={car.city || "-"} />
                  <Spec icon={Calendar} label="Year" value={car.year || "-"} />
                  <Spec icon={Users} label="Seats" value={car.seats ? `${car.seats} Seats` : "-"} />
                  <Spec icon={Fuel} label="Fuel" value={car.fuel_type || "-"} />
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-black text-gray-900 mb-2">Car Details</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {car.car_details || "No details available."}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <MiniBadge icon={Shield} title="Secure Booking" sub="Protected checkout" />
                  <MiniBadge icon={Clock} title="Fast Pickup" sub="Quick confirmation" />
                  <MiniBadge icon={CheckCircle2} title="Verified Cars" sub="Quality checked" />
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-3xl shadow border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Reviews
                </h2>
                <span className="text-sm text-gray-600">
                  {loadingReviews ? "Loading..." : `${reviews.length} review(s)`}
                </span>
              </div>

              {loadingReviews ? (
                <div className="text-gray-600">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-gray-600">No reviews yet.</div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-2xl border bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-gray-900">{r.user_name || "User"}</div>
                        <div className="text-sm text-gray-600">
                          {r.created_at ? String(r.created_at).slice(0, 10) : ""}
                        </div>
                      </div>
                      <div className="mt-2 text-gray-700">{r.message || r.feedback || "—"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl shadow border p-6">
              <h3 className="text-xl font-black text-gray-900 mb-4">Booking Summary</h3>

              <div className="space-y-3 text-sm">
                <Row label="Mode" value={trip.booking_mode || "RENTAL"} />
                <Row label="Billing" value={trip.billing_type || "PER_DAY"} />
                <Row label="Pickup" value={trip.pickup_location || "—"} />
                <Row label="Drop" value={trip.drop_location || "—"} />
                <Row label="Start" value={trip.start_date || "—"} />
                <Row label="End" value={(trip.booking_mode === "TRANSFER" ? trip.start_date : trip.end_date) || "—"} />
              </div>

              <div className="my-5 border-t" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Price per day</p>
                  <p className="text-3xl font-black text-gray-900 flex items-center gap-1">
                    <IndianRupee className="w-6 h-6" />
                    {Number(car.price_per_day || 0).toLocaleString()}
                  </p>
                </div>

                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-black ${
                    Number(car.is_available ?? 1) === 1
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {Number(car.is_available ?? 1) === 1 ? "AVAILABLE" : "NOT AVAILABLE"}
                </div>
              </div>

              <button
                onClick={handleBookNow}
                disabled={Number(car.is_available ?? 1) !== 1}
                className={`mt-6 w-full py-3 rounded-2xl font-black transition ${
                  Number(car.is_available ?? 1) === 1
                    ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:opacity-95"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Spec({ icon: Icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border">
      <div className="flex items-center gap-2 text-gray-600 text-sm font-semibold">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className="mt-2 text-gray-900 font-black">{value}</div>
    </div>
  );
}

function MiniBadge({ icon: Icon, title, sub }) {
  return (
    <div className="rounded-2xl border bg-gray-50 p-4">
      <div className="flex items-center gap-2 font-black text-gray-900">
        <Icon className="w-4 h-4 text-cyan-600" />
        {title}
      </div>
      <div className="text-xs text-gray-600 mt-1">{sub}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-gray-500 font-semibold">{label}</div>
      <div className="text-gray-900 font-black text-right">{value}</div>
    </div>
  );
}

export default CarDetails;
