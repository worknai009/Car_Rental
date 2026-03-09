import React, { useEffect, useMemo, useState } from "react";
import ScrollReveal from "scrollreveal";
import {
  Car,
  MapPin,
  Users,
  Fuel,
  Star,
  ArrowRight,
  Search,
  Filter,
  X,
  Heart,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import userApi from "../utils/userApi";

const toNumOrNull = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const normalizeMode = (m) => (String(m || "RENTAL").toUpperCase() === "TRANSFER" ? "TRANSFER" : "RENTAL");
const normalizeBilling = (b, mode) => {
  const x = String(b || "").toUpperCase();
  if (x === "PER_KM" || x === "PER_DAY") return x;
  // default by mode
  return mode === "TRANSFER" ? "PER_KM" : "PER_DAY";
};

const CarsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // -------------------------
  // DATA STATES
  // -------------------------
  const [cars, setCars] = useState([]);
  const [allCarsForOptions, setAllCarsForOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // FILTER STATES
  // -------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all"); // CITY
  const [selectedBadge, setSelectedBadge] = useState("all"); // PLATINUM | GOLD | SILVER

  const [selectedFuel, setSelectedFuel] = useState("all");
  const [selectedSeats, setSelectedSeats] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // -------------------------
  // TRIP STATE
  // -------------------------
  const [trip, setTrip] = useState(null);
  const billingType = trip?.billing_type || "PER_DAY";
  const isPerKm = billingType === "PER_KM";


  const getTripData = () => {
    if (trip) return trip;

    const saved = localStorage.getItem("tripSearch");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  };

  const buildTripQS = (t) => {
    const qs = new URLSearchParams();
    const mode = normalizeMode(t?.booking_mode);
    const billing = normalizeBilling(t?.billing_type, mode);

    const start = t?.start_date || "";
    const end = mode === "TRANSFER" ? start : (t?.end_date || "");

    qs.set("pickup_location", t?.pickup_location || "");
    qs.set("drop_location", t?.drop_location || "");
    qs.set("start_date", start);
    qs.set("start_time", t?.start_time || "");
    qs.set("end_date", end);
    qs.set("booking_mode", mode);
    qs.set("billing_type", billing);

    // ✅ coords
    if (t?.pickup_lat != null) qs.set("pickup_lat", String(t.pickup_lat));
    if (t?.pickup_lng != null) qs.set("pickup_lng", String(t.pickup_lng));
    if (t?.drop_lat != null) qs.set("drop_lat", String(t.drop_lat));
    if (t?.drop_lng != null) qs.set("drop_lng", String(t.drop_lng));

    return qs.toString();
  };

  const goToDetails = (carId) => {
    const t = getTripData();
    const mode = normalizeMode(t?.booking_mode);

    const hasTrip =
      t?.pickup_location &&
      t?.drop_location &&
      t?.start_date &&
      (mode === "TRANSFER" ? true : !!t?.end_date);

    if (hasTrip) navigate(`/cars/${carId}?${buildTripQS(t)}`);
    else navigate(`/cars/${carId}`);
  };

  // ✅ Read trip from URL OR localStorage
  useEffect(() => {
    const qs = new URLSearchParams(location.search);

    const mode = normalizeMode(qs.get("booking_mode") || "");
    const start_date = qs.get("start_date") || "";

    const t = {
      pickup_location: qs.get("pickup_location") || "",
      drop_location: qs.get("drop_location") || "",
      start_date,
      start_time: qs.get("start_time") || "",
      end_date: mode === "TRANSFER" ? start_date : (qs.get("end_date") || ""),
      booking_mode: mode,
      billing_type: normalizeBilling(qs.get("billing_type"), mode),

      // ✅ coords (important for PER_KM)
      pickup_lat: toNumOrNull(qs.get("pickup_lat")),
      pickup_lng: toNumOrNull(qs.get("pickup_lng")),
      drop_lat: toNumOrNull(qs.get("drop_lat")),
      drop_lng: toNumOrNull(qs.get("drop_lng")),
    };

    const hasUrlTrip =
      t.pickup_location &&
      t.drop_location &&
      t.start_date &&
      (t.booking_mode === "TRANSFER" ? true : !!t.end_date);

    if (hasUrlTrip) {
      setTrip(t);
      localStorage.setItem("tripSearch", JSON.stringify(t));
      return;
    }

    const saved = localStorage.getItem("tripSearch");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedMode = normalizeMode(parsed.booking_mode);
        const savedStart = parsed.start_date || "";
        const normalized = {
          pickup_location: parsed.pickup_location || "",
          drop_location: parsed.drop_location || "",
          start_date: savedStart,
          start_time: parsed.start_time || "",
          end_date: savedMode === "TRANSFER" ? savedStart : (parsed.end_date || ""),
          booking_mode: savedMode,
          billing_type: normalizeBilling(parsed.billing_type, savedMode),

          pickup_lat: toNumOrNull(parsed.pickup_lat),
          pickup_lng: toNumOrNull(parsed.pickup_lng),
          drop_lat: toNumOrNull(parsed.drop_lat),
          drop_lng: toNumOrNull(parsed.drop_lng),
        };
        setTrip(normalized);
      } catch {
        setTrip(null);
      }
    } else {
      setTrip(null);
    }
  }, [location.search]);

  // -------------------------
  // ✅ Fetch ALL cars
  // -------------------------
  const fetchAllCars = async () => {
    try {
      setLoading(true);
      const res = await userApi.get("/cars");
      const list = Array.isArray(res.data) ? res.data : [];

      const normalized = list.map((c) => ({
        ...c,
        is_available: Number(c.is_available ?? 0),
      }));

      setCars(normalized);
      setAllCarsForOptions(normalized);
    } catch (err) {
      console.error("Fetch cars error:", err);
      setCars([]);
      setAllCarsForOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // ✅ Fetch filtered cars from backend
  // -------------------------
  const fetchFilteredCars = async () => {
    try {
      setLoading(true);

      const hasFilters =
        selectedLocation !== "all" ||
        selectedFuel !== "all" ||
        selectedSeats !== "all" ||
        selectedBadge !== "all" ||
        minPrice !== "" ||
        maxPrice !== "";

      if (!hasFilters) {
        await fetchAllCars();
        return;
      }

      const params = {};
      if (selectedLocation !== "all") params.city = selectedLocation;
      if (selectedFuel !== "all") params.fuel_type = selectedFuel;
      if (selectedSeats !== "all") params.seats = selectedSeats;
      if (selectedBadge !== "all") params.badge = selectedBadge;
      if (minPrice !== "") params.min_price = minPrice;
      if (maxPrice !== "") params.max_price = maxPrice;

      const res = await userApi.get("/cars/filter", { params });
      const list = Array.isArray(res.data) ? res.data : [];

      setCars(
        list.map((c) => ({
          ...c,
          is_available: Number(c.is_available ?? 0),
        }))
      );
    } catch (err) {
      console.error("Filter cars error:", err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    fetchFilteredCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, selectedFuel, selectedSeats, selectedBadge, minPrice, maxPrice]);

  // -------------------------
  // Scroll animations
  // -------------------------
  useEffect(() => {
    const sr = ScrollReveal({
      reset: false,
      distance: "60px",
      duration: 1200,
      easing: "ease-in-out",
    });
    sr.reveal(".page-header", { origin: "top", distance: "30px" });
    sr.reveal(".search-section", { origin: "top", delay: 100 });
    sr.reveal(".car-card", {
      origin: "bottom",
      interval: 100,
      viewFactor: 0.2,
    });
  }, []);

  // -------------------------
  // Dropdown options
  // -------------------------
  const locations = useMemo(() => {
    const set = new Set(allCarsForOptions.map((c) => c.city).filter(Boolean));
    return Array.from(set);
  }, [allCarsForOptions]);

  const fuels = useMemo(() => {
    const set = new Set(allCarsForOptions.map((c) => c.fuel_type).filter(Boolean));
    return Array.from(set);
  }, [allCarsForOptions]);

  const seatsOptions = useMemo(() => {
    const set = new Set(allCarsForOptions.map((c) => c.seats).filter(Boolean));
    return Array.from(set).sort((a, b) => Number(a) - Number(b));
  }, [allCarsForOptions]);

  // -------------------------
  // Search + Sort (client-side)
  // -------------------------
  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (car) =>
          (car.name || "").toLowerCase().includes(q) ||
          (car.brand || "").toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => Number(a.price_per_day) - Number(b.price_per_day));
        break;
      case "price-high":
        result.sort((a, b) => Number(b.price_per_day) - Number(a.price_per_day));
        break;
      case "rating":
        result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      case "newest":
        result.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
        break;
      case "is_available":
        result.sort( (a, b) => Number(b.is_available) - Number(a.is_available));
      default:
        break;
    }

    return result;
  }, [cars, searchQuery, sortBy]);

  // -------------------------
  // Helpers
  // -------------------------
  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("all");
    setSelectedFuel("all");
    setSelectedSeats("all");
    setSelectedBadge("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("featured");
  };

  const activeFiltersCount = [
    selectedLocation !== "all",
    selectedFuel !== "all",
    selectedSeats !== "all",
    selectedBadge !== "all",
    minPrice !== "" || maxPrice !== "",
  ].filter(Boolean).length;

  // -------------------------
  // Book Now
  // -------------------------
  const handleBookNow = (car) => {
    const t =
      trip ||
      (() => {
        const saved = localStorage.getItem("tripSearch");
        if (!saved) return null;
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      })();

    if (!t || !t.pickup_location || !t.drop_location || !t.start_date) {
      alert("Please fill booking form first on Home page ✅");
      navigate("/");
      return;
    }

    const mode = normalizeMode(t.booking_mode);
    const billing = normalizeBilling(t.billing_type, mode);
    const end = mode === "TRANSFER" ? (t.start_date || "") : (t.end_date || "");

    if (mode === "RENTAL" && !end) {
      alert("Please select return date on Home page ✅");
      navigate("/");
      return;
    }

    // ✅ if PER_KM must have coords
    if (billing === "PER_KM") {
      if (!t.pickup_lat || !t.pickup_lng || !t.drop_lat || !t.drop_lng) {
        alert("For PER_KM, please select Pickup & Drop from Google suggestions ✅");
        navigate("/");
        return;
      }
    }

    const qs = new URLSearchParams();
    qs.set("car_id", String(car.id));
    qs.set("pickup_location", t.pickup_location || "");
    qs.set("drop_location", t.drop_location || "");
    qs.set("start_date", t.start_date || "");
    qs.set("start_time", t.start_time || "");
    qs.set("end_date", end);
    qs.set("booking_mode", mode);
    qs.set("billing_type", billing);

    if (t.pickup_lat != null) qs.set("pickup_lat", String(t.pickup_lat));
    if (t.pickup_lng != null) qs.set("pickup_lng", String(t.pickup_lng));
    if (t.drop_lat != null) qs.set("drop_lat", String(t.drop_lat));
    if (t.drop_lng != null) qs.set("drop_lng", String(t.drop_lng));

    navigate(`/review-booking?${qs.toString()}`, { state: { car } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-30 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="page-header text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 px-4 py-2 rounded-full font-semibold text-sm border border-cyan-200">
            <Car className="w-5 h-5" />
            <span>Browse Our Collection</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Ride
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cars are loaded dynamically from your database. Use filters to find
            the best match.
          </p>

          {/* Trip badge */}
          {trip?.pickup_location && trip?.drop_location && (
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border shadow-sm text-sm text-gray-700">
              <span className="font-bold">Trip:</span>
              <span>{trip.pickup_location}</span>
              <ArrowRight className="w-4 h-4" />
              <span>{trip.drop_location}</span>
              <span className="text-gray-400">|</span>
              <span>{trip.start_date}</span>
              <ArrowRight className="w-4 h-4" />
              <span>{trip.booking_mode === "TRANSFER" ? trip.start_date : trip.end_date}</span>
              <span className="text-gray-400">|</span>
              <span className="font-bold">{trip.billing_type || "PER_DAY"}</span>
            </div>
          )}
        </div>

        {/* SEARCH + FILTERS */}
        <div className="search-section mb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by car name or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all relative"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* FILTER GRID */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 ${showFilters ? "grid" : "hidden"} lg:grid`}>
              {/* Badge */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Car Type</label>
                <select
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 cursor-pointer"
                >
                  <option value="all">All</option>
                  <option value="PLATINUM">Platinum</option>
                  <option value="GOLD">Gold</option>
                  <option value="SILVER">Silver</option>
                </select>
              </div>

              {/* Location */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 cursor-pointer"
                >
                  <option value="all">All</option>
                  {locations.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Fuel */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Fuel</label>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 cursor-pointer"
                >
                  <option value="all">All</option>
                  {fuels.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Seats */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Seats</label>
                <select
                  value={selectedSeats}
                  onChange={(e) => setSelectedSeats(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 cursor-pointer"
                >
                  <option value="all">All</option>
                  {seatsOptions.map((s) => (
                    <option key={s} value={String(s)}>{s} Seats</option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Min Price</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              {/* Max Price */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="99999"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              {/* Clear */}
              <div className="lg:col-span-1 flex items-end">
                <button
                  onClick={clearFilters}
                  disabled={activeFiltersCount === 0 && !searchQuery}
                  className={`w-full px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeFiltersCount > 0 || searchQuery
                    ? "bg-cyan-100 text-cyan-600 hover:bg-cyan-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  <X className="w-5 h-5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span className="font-medium">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Cars</h2>
            <p className="text-gray-600 mt-1">
              {loading ? "Loading..." : `${filteredCars.length} vehicle${filteredCars.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Instant Booking</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Best Prices</span>
            </div>
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="bg-white rounded-2xl p-6 shadow text-gray-600">
            Loading cars from database...
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredCars.map((car) => {
              const isFavorite = favorites.includes(car.id);
              const isAvailable = Number(car.is_available) === 1;
              const imageUrl = car.cars_image ? `${import.meta.env.VITE_API_URL}/public/${car.cars_image}` : "";

              return (
                <div
                  key={car.id}
                  className={`car-card group bg-white rounded-3xl overflow-hidden shadow-md transition-all duration-500 border border-gray-100
                    ${isAvailable ? "hover:shadow-2xl hover:-translate-y-2" : "opacity-60"}`}
                >
                  {/* IMAGE */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={car.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {car.badge ? (
                      <div
                        className={`absolute top-4 left-4 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg
                          ${String(car.badge).toUpperCase() === "PLATINUM"
                            ? "bg-purple-600"
                            : String(car.badge).toUpperCase() === "GOLD"
                              ? "bg-yellow-500 text-black"
                              : String(car.badge).toUpperCase() === "SILVER"
                                ? "bg-gray-300 text-gray-900"
                                : "bg-cyan-600"
                          }`}
                      >
                        {car.badge}
                      </div>
                    ) : null}

                    <button
                      onClick={() => toggleFavorite(car.id)}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border ${isFavorite
                        ? "bg-pink-500 border-pink-500 text-white scale-110"
                        : "bg-white/80 border-white/50 text-gray-700 hover:bg-white hover:scale-110"
                        }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transform transition-all duration-500 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => goToDetails(car.id)}
                        className="w-full bg-white text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2"
                        type="button"
                      >
                        View Details <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MapPin className="w-4 h-4 text-cyan-500" />
                        <span className="font-medium">{car.city || "-"}</span>
                      </div>
                      <span className="text-gray-500 font-medium">{car.year || "-"}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{car.name}</h3>

                    <p className="text-sm text-gray-600">
                      {car.brand} • {car.category_name || "Category"}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-700" />
                        </div>
                        <span className="font-medium">{car.seats || "-"} Seats</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Fuel className="w-4 h-4 text-gray-700" />
                        </div>
                        <span className="font-medium">{car.fuel_type || "-"}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200" />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-medium">Starting from</p>
                        <p className="text-2xl font-black text-gray-900">
                          ₹{Number(isPerKm ? car.price_per_km : car.price_per_day || 0).toLocaleString()}
                          <span className="text-sm font-normal text-gray-500">
                            {isPerKm ? "/km" : "/day"}
                          </span>
                        </p>

                      </div>

                      <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-2 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-gray-900">{car.rating || "0.0"}</span>
                      </div>
                    </div>

                    <button
                      disabled={!isAvailable}
                      onClick={() => isAvailable && handleBookNow(car)}
                      className={`w-full font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-3
                        ${isAvailable
                          ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white hover:shadow-2xl transform hover:scale-105"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed opacity-70"
                        }`}
                    >
                      {isAvailable ? "Book Now" : "Not Available"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No cars found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarsPage;
