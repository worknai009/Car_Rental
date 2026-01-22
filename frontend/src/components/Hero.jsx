import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Search,
  ArrowRight,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import ScrollReveal from "scrollreveal";
import { useNavigate } from "react-router-dom";
import userApi from "../utils/userApi";

import { Autocomplete, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

// ✅ Move this OUTSIDE Hero (important)
const PlacesInput = ({
  isLoaded,
  value,
  onChange,
  onSelect,
  placeholder,
  inputClassName,
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
        className={inputClassName}
        autoComplete="off"
        required
      />
    );
  }

  return (
    <Autocomplete
      onLoad={(ac) => {
        acRef.current = ac;
      }}
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

        // ✅ set text in input
        onChange(address);

        // ✅ save coords
        onSelect?.({ address, lat, lng });
      }}
      options={{
        // types: ["geocode"],
        // componentRestrictions: { country: "in" },
      }}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClassName}
        autoComplete="off"
        required
      />
    </Autocomplete>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  const [billingType, setBillingType] = useState("PER_DAY"); // PER_DAY | PER_KM
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropupLocation, setDropupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [bookingMode, setBookingMode] = useState("RENTAL");

  const [pickupCoords, setPickupCoords] = useState({ lat: null, lng: null });
  const [dropCoords, setDropCoords] = useState({ lat: null, lng: null });

  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    avgRating: "4.9",
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // ✅ Google script loader
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "",
    libraries,
  });

  // ✅ Auto default billing type based on mode
  useEffect(() => {
    if (bookingMode === "TRANSFER") setBillingType("PER_KM"); // default
    if (bookingMode === "RENTAL") setBillingType("PER_DAY"); // default
  }, [bookingMode]);

  useEffect(() => {
    const sr = ScrollReveal({ reset: false, easing: "ease-in-out" });
    sr.reveal(".head-section", { scale: 0.9, duration: 1500 });
    sr.reveal(".hero-reveal", {
      origin: "left",
      distance: "50px",
      duration: 1000,
    });
    sr.reveal(".reveal-y", {
      origin: "bottom",
      distance: "100px",
      duration: 1500,
      interval: 200,
    });
    sr.reveal(".feature-card", {
      origin: "bottom",
      distance: "50px",
      duration: 1000,
      interval: 150,
    });
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const [carsRes, availableRes] = await Promise.all([
          userApi.get("/cars"),
          userApi.get("/cars/available"),
        ]);

        const allCars = Array.isArray(carsRes.data) ? carsRes.data : [];
        const availableCars = Array.isArray(availableRes.data)
          ? availableRes.data
          : [];

        const ratings = allCars
          .map((c) => Number(c.rating))
          .filter((r) => !Number.isNaN(r) && r > 0);

        const avgRating =
          ratings.length > 0
            ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
            : "4.9";

        setStats({
          totalCars: allCars.length,
          availableCars: availableCars.length,
          avgRating,
        });
      } catch (err) {
        console.error("Hero stats error:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const features = useMemo(
    () => [
      {
        icon: Star,
        text: statsLoading ? "..." : `${stats.availableCars}+ Premium Cars`,
        color: "text-emerald-400",
      },
      { icon: Shield, text: "Fully Insured", color: "text-sky-400" },
      { icon: Zap, text: "Instant Booking", color: "text-amber-400" },
    ],
    [stats.availableCars, statsLoading]
  );

  useEffect(() => {
    if (bookingMode === "TRANSFER") setReturnDate("");
  }, [bookingMode]);

  const handleSearch = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!pickupLocation || !dropupLocation || !pickupDate || !pickupTime) {
      alert("Please fill all fields");
      return;
    }

    if (bookingMode === "RENTAL" && !returnDate) {
      alert("Please select return date");
      return;
    }

    if (bookingMode === "RENTAL") {
      const sd = new Date(pickupDate);
      const ed = new Date(returnDate);
      if (ed < sd) {
        alert("Return date must be after pickup date");
        return;
      }
    }

    // ✅ IMPORTANT: If billing is PER_KM, require lat/lng
    if (billingType === "PER_KM") {
      if (!pickupCoords.lat || !dropCoords.lat) {
        alert(
          "Please select Pickup & Drop from Google suggestions (click a suggestion), not just typing."
        );
        return;
      }
    }

    const trip = {
      booking_mode: bookingMode,
      billing_type: billingType,
      pickup_location: pickupLocation,
      drop_location: dropupLocation,
      start_date: pickupDate,
      start_time: pickupTime,
      end_date: bookingMode === "TRANSFER" ? pickupDate : returnDate,
      pickup_lat: pickupCoords.lat,
      pickup_lng: pickupCoords.lng,
      drop_lat: dropCoords.lat,
      drop_lng: dropCoords.lng,
    };

    try {
      setSearching(true);
      localStorage.setItem("tripSearch", JSON.stringify(trip));
      window.dispatchEvent(new Event("tripSearchUpdated"));



      // ✅ Send everything in URL (coords + billing type)
      navigate(
        `/cars?pickup_location=${encodeURIComponent(trip.pickup_location)}` +
        `&drop_location=${encodeURIComponent(trip.drop_location)}` +
        `&start_date=${encodeURIComponent(trip.start_date)}` +
        `&start_time=${encodeURIComponent(trip.start_time)}` +
        `&end_date=${encodeURIComponent(trip.end_date)}` +
        `&booking_mode=${encodeURIComponent(trip.booking_mode)}` +
        `&billing_type=${encodeURIComponent(trip.billing_type)}` +
        `&pickup_lat=${encodeURIComponent(trip.pickup_lat ?? "")}` +
        `&pickup_lng=${encodeURIComponent(trip.pickup_lng ?? "")}` +
        `&drop_lat=${encodeURIComponent(trip.drop_lat ?? "")}` +
        `&drop_lng=${encodeURIComponent(trip.drop_lng ?? "")}`
      );
    } finally {
      setSearching(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-30 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-slate-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="head-section space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Book in 60 Seconds</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight">
              Your Perfect Ride
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-slate-200 bg-clip-text text-transparent">
                Awaits You
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
              Premium vehicles, unbeatable prices, and seamless booking experience
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="feature-card flex items-center gap-2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full border border-white/20 text-white"
                >
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                  <span className="text-sm font-semibold">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hero-reveal max-w-6xl mx-auto ">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Search className="w-6 h-6 text-emerald-600" />
                Find Your Car
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Fill in the details to search available vehicles
              </p>
            </div>

            <form onSubmit={handleSearch} className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="reveal-y space-y-2">
                  <label className="text-sm font-bold text-slate-700">Service</label>
                  <select
                    value={bookingMode}
                    onChange={(e) => setBookingMode(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                  >
                    <option value="RENTAL">Rental (Two-way)</option>
                    <option value="TRANSFER">Transfer (One-way)</option>
                  </select>
                </div>

                <div className="reveal-y space-y-2">
                  <label className="text-sm font-bold text-slate-700">Billing</label>
                  <select
                    value={billingType}
                    onChange={(e) => setBillingType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                  >
                    <option value="PER_DAY">Per Day</option>
                    <option value="PER_KM">Per KM</option>
                  </select>
                </div>

                <div className="reveal-y space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Pickup
                  </label>

                  <PlacesInput
                    isLoaded={isLoaded}
                    value={pickupLocation}
                    onChange={(v) => {
                      setPickupLocation(v);
                      setPickupCoords({ lat: null, lng: null }); // ✅ reset coords if user changes typing
                    }}
                    onSelect={({ lat, lng }) =>
                      setPickupCoords({ lat: lat ?? null, lng: lng ?? null })
                    }
                    placeholder="Enter pickup location"
                    inputClassName="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                  />
                </div>

                <div className="reveal-y space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Drop
                  </label>

                  <PlacesInput
                    isLoaded={isLoaded}
                    value={dropupLocation}
                    onChange={(v) => {
                      setDropupLocation(v);
                      setDropCoords({ lat: null, lng: null }); // ✅ reset coords if user changes typing
                    }}
                    onSelect={({ lat, lng }) =>
                      setDropCoords({ lat: lat ?? null, lng: lng ?? null })
                    }
                    placeholder="Enter drop location"
                    inputClassName="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                  />
                </div>

                <div className="reveal-y space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                    required
                  />
                </div>

                <div className="reveal-y space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                    required
                  />
                </div>

                {bookingMode === "RENTAL" ? (
                  <div className="reveal-y space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={pickupDate || new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                      required
                    />
                  </div>
                ) : (
                  <div className="reveal-y space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      Return Date
                    </label>
                    <input
                      type="text"
                      value="Not required for Transfer"
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500"
                    />
                  </div>
                )}
              </div>

              <div className="reveal-y mt-6">
                <button
                  type="submit"
                  disabled={searching}
                  className="w-full group relative bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                    <Search className="w-6 h-6" />
                    {searching ? "Searching..." : "Search Available Cars"}
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="feature-card bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
              <div className="text-3xl font-black text-white">
                {statsLoading ? "..." : `${stats.totalCars}+`}
              </div>
              <div className="text-sm text-slate-200 font-medium mt-1">Cars Available</div>
            </div>
            <div className="feature-card bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
              <div className="text-3xl font-black text-white">
                {statsLoading ? "..." : `${stats.availableCars}+`}
              </div>
              <div className="text-sm text-slate-200 font-medium mt-1">Available Now</div>
            </div>
            <div className="feature-card bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center border border-white/20">
              <div className="text-3xl font-black text-white">
                {statsLoading ? "..." : `${stats.avgRating}★`}
              </div>
              <div className="text-sm text-slate-200 font-medium mt-1">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .delay-500 { animation-delay: 500ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </section>
  );
};

export default Hero;
