import React, { useEffect, useMemo, useState } from "react";
import ScrollReveal from "scrollreveal";
import {
  Bus,
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
  return mode === "TRANSFER" ? "PER_KM" : "PER_DAY";
};

const BusesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cars, setCars] = useState([]);
  const [allCarsForOptions, setAllCarsForOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedBadge, setSelectedBadge] = useState("all");
  const [selectedFuel, setSelectedFuel] = useState("all");
  const [selectedSeats, setSelectedSeats] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [trip, setTrip] = useState(null);

  const billingType = trip?.billing_type || "PER_DAY";
  const isPerKm = billingType === "PER_KM";

  const fetchBuses = async () => {
    try {
      setLoading(true);
      // Fetch only buses
      const res = await userApi.get("/cars/filter", { params: { vehicle_type: 'BUS' } });
      const list = Array.isArray(res.data) ? res.data : [];
      const normalized = list.map((c) => ({
        ...c,
        is_available: Number(c.is_available ?? 0),
      }));
      setCars(normalized);
      setAllCarsForOptions(normalized);
    } catch (err) {
      console.error("Fetch buses error:", err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredBuses = async () => {
    try {
      setLoading(true);
      const params = { vehicle_type: 'BUS' };
      if (selectedLocation !== "all") params.city = selectedLocation;
      if (selectedFuel !== "all") params.fuel_type = selectedFuel;
      if (selectedSeats !== "all") params.seats = selectedSeats;
      if (selectedBadge !== "all") params.badge = selectedBadge;
      if (minPrice !== "") params.min_price = minPrice;
      if (maxPrice !== "") params.max_price = maxPrice;

      const res = await userApi.get("/cars/filter", { params });
      const list = Array.isArray(res.data) ? res.data : [];
      setCars(list.map((c) => ({ ...c, is_available: Number(c.is_available ?? 0) })));
    } catch (err) {
      console.error("Filter buses error:", err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredBuses();
  }, [selectedLocation, selectedFuel, selectedSeats, selectedBadge, minPrice, maxPrice]);

  useEffect(() => {
    const sr = ScrollReveal({ reset: false, distance: "60px", duration: 1200, easing: "ease-in-out" });
    sr.reveal(".page-header", { origin: "top", distance: "30px" });
    sr.reveal(".search-section", { origin: "top", delay: 100 });
    sr.reveal(".car-card", { origin: "bottom", interval: 100, viewFactor: 0.2 });
  }, []);

  const locations = useMemo(() => Array.from(new Set(allCarsForOptions.map((c) => c.city).filter(Boolean))), [allCarsForOptions]);
  const fuels = useMemo(() => Array.from(new Set(allCarsForOptions.map((c) => c.fuel_type).filter(Boolean))), [allCarsForOptions]);
  const seatsOptions = useMemo(() => Array.from(new Set(allCarsForOptions.map((c) => c.seats).filter(Boolean))).sort((a, b) => Number(a) - Number(b)), [allCarsForOptions]);

  const filteredBuses = useMemo(() => {
    let result = [...cars];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((car) => (car.name || "").toLowerCase().includes(q) || (car.brand || "").toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "price-low": result.sort((a, b) => Number(a.price_per_day) - Number(b.price_per_day)); break;
      case "price-high": result.sort((a, b) => Number(b.price_per_day) - Number(a.price_per_day)); break;
      case "rating": result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)); break;
      case "newest": result.sort((a, b) => Number(b.year || 0) - Number(a.year || 0)); break;
      case "is_available": result.sort((a, b) => Number(b.is_available) - Number(a.is_available)); break;
      default: break;
    }
    return result;
  }, [cars, searchQuery, sortBy]);

  const handleBookNow = (car) => {
    const t = trip || (() => {
      const saved = localStorage.getItem("tripSearch");
      if (!saved) return null;
      try { return JSON.parse(saved); } catch { return null; }
    })();

    if (!t || !t.pickup_location || !t.drop_location || !t.start_date) {
      alert("Please fill booking form first on Home page ✅");
      navigate("/");
      return;
    }
    const mode = normalizeMode(t.booking_mode);
    const billing = normalizeBilling(t.billing_type, mode);
    const end = mode === "TRANSFER" ? (t.start_date || "") : (t.end_date || "");

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
        <div className="page-header text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 px-4 py-2 rounded-full font-semibold text-sm border border-cyan-200">
            <Bus className="w-5 h-5" />
            <span>Luxury Bus Collection</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">
            Premium <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Bus Rentals</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience comfort and luxury with our wide range of premium buses.
          </p>
        </div>

        <div className="search-section mb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by bus name or brand..."
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

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 ${showFilters ? "grid" : "hidden"} lg:grid`}>
               {/* Location */}
               <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 cursor-pointer">
                  <option value="all">All</option>
                  {locations.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Fuel */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Fuel</label>
                <select value={selectedFuel} onChange={(e) => setSelectedFuel(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 cursor-pointer">
                  <option value="all">All</option>
                  {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              {/* Seats */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Seats</label>
                <select value={selectedSeats} onChange={(e) => setSelectedSeats(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 cursor-pointer">
                  <option value="all">All</option>
                  {seatsOptions.map((s) => <option key={s} value={String(s)}>{s} Seats</option>)}
                </select>
              </div>
              {/* Min Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Min Price</label>
                <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all" />
              </div>
              {/* Max Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Price</label>
                <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="99999" className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all" />
              </div>
              {/* Clear */}
              <div className="flex items-end">
                <button onClick={() => { setSearchQuery(""); setSelectedLocation("all"); setSelectedFuel("all"); setSelectedSeats("all"); setSelectedBadge("all"); setMinPrice(""); setMaxPrice(""); setSortBy("featured"); }} className="w-full px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 bg-cyan-100 text-cyan-600 hover:bg-cyan-200">
                  <X className="w-5 h-5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="text-center py-20 text-gray-600">Loading buses...</div>
        ) : filteredBuses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredBuses.map((car) => {
              const isAvailable = Number(car.is_available) === 1;
              return (
                <div key={car.id} className="car-card group bg-white rounded-3xl overflow-hidden shadow-md transition-all duration-500 border border-gray-100 hover:shadow-2xl hover:-translate-y-2">
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img src={`${import.meta.env.VITE_API_URL}/public/${car.cars_image}`} alt={car.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg uppercase tracking-wider">
                      {car.vehicle_type || 'BUS'}
                    </div>
                    <button onClick={() => setFavorites(prev => prev.includes(car.id) ? prev.filter(x => x !== car.id) : [...prev, car.id])} className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/80 ${favorites.includes(car.id) ? 'text-pink-500' : 'text-gray-700'}`}>
                      <Heart className={`w-5 h-5 ${favorites.includes(car.id) ? 'fill-current' : ''}`} />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transform transition-all duration-500 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                      <button onClick={() => navigate(`/cars/${car.id}`)} className="w-full bg-white text-gray-900 font-bold py-2.5 rounded-lg">View Details</button>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{car.name}</h3>
                    <p className="text-sm text-gray-600">{car.brand} • {car.city}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {car.seats} Seats</span>
                      <span className="flex items-center gap-1"><Fuel className="w-4 h-4" /> {car.fuel_type}</span>
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
                        <span className="text-sm font-bold">{car.rating || "0.0"}</span>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No buses found</h3>
            <p className="text-gray-600">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusesPage;
