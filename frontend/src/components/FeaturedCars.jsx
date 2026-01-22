import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "scrollreveal";
import userApi from "../utils/userApi";

import {
  MapPin,
  Users,
  Fuel,
  Star,
  ArrowRight,
  Heart,
  CheckCircle2,
} from "lucide-react";

const badgeClass = (badge) => {
  const b = String(badge || "").trim().toUpperCase();

  if (b === "PLATINUM") return "bg-purple-600";
  if (b === "GOLD") return "bg-yellow-500 text-black";   // readable
  if (b === "SILVER") return "bg-gray-300 text-gray-900"; // silver + dark text

  // keep your old custom badges too
  const low = b.toLowerCase();
  if (low.includes("popular")) return "bg-blue-500";
  if (low.includes("premium")) return "bg-purple-500";
  if (low.includes("best")) return "bg-green-500";
  if (low.includes("family")) return "bg-orange-500";
  if (low.includes("electric")) return "bg-emerald-500";
  if (low.includes("adventure")) return "bg-cyan-500";

  return "bg-gray-800";
};


const FeaturedCars = () => {
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [billingType, setBillingType] = useState("PER_DAY");


  useEffect(() => {
    const readBillingType = () => {
      const saved = localStorage.getItem("tripSearch");
      if (!saved) {
        setBillingType("PER_DAY");
        return;
      }
      try {
        const t = JSON.parse(saved);
        setBillingType((t.billing_type || "PER_DAY").toUpperCase());
      } catch {
        setBillingType("PER_DAY");
      }
    };

    readBillingType();

    window.addEventListener("tripSearchUpdated", readBillingType);
    return () =>
      window.removeEventListener("tripSearchUpdated", readBillingType);
  }, []);


  useEffect(() => {
    const sr = ScrollReveal({
      reset: false,
      distance: "60px",
      duration: 1200,
      easing: "ease-in-out",
      viewFactor: 0.2,
    });

    sr.reveal(".featured-header", { origin: "top", distance: "30px" });
    sr.reveal(".featured-card", { origin: "bottom", interval: 120 });
  }, []);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setLoading(true);

        // ✅ Fetch cars (you can use /cars or /cars/available)
        const res = await userApi.get("/cars");
        const list = Array.isArray(res.data) ? res.data : [];

        // ✅ normalize is_available
        const normalized = list.map((c) => ({
          ...c,
          is_available: Number(c.is_available ?? 0),
        }));

        // ✅ latest 6
        const latest = [...normalized]
          .sort((a, b) => Number(b.id) - Number(a.id))
          .slice(0, 6);

        setCars(latest);
      } catch (err) {
        console.error("FeaturedCars API error:", err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ✅ same booking logic like CarsPage
  const handleBookNow = (car) => {
    const saved = localStorage.getItem("tripSearch");
    let t = null;

    if (saved) {
      try {
        t = JSON.parse(saved);
      } catch {
        t = null;
      }
    }

    if (!t || !t.pickup_location || !t.drop_location || !t.start_date || !t.end_date) {
      alert("Please fill booking form first on Home page ✅");
      navigate("/");
      return;
    }

    navigate(
      `/review-booking?car_id=${car.id}` +
      `&pickup_location=${encodeURIComponent(t.pickup_location)}` +
      `&drop_location=${encodeURIComponent(t.drop_location)}` +
      `&start_date=${encodeURIComponent(t.start_date)}` +
      `&start_time=${encodeURIComponent(t.start_time || "")}` +
      `&end_date=${encodeURIComponent(t.end_date)}` +
      `&booking_mode=${encodeURIComponent((t.booking_mode || "RENTAL").toUpperCase())}`, // ✅ ADD
      { state: { car } }
    );

  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="featured-header flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Featured <span className="text-cyan-600">Vehicles</span>
            </h2>
            <p className="text-gray-600 mt-2">
              Discover our latest cars from database (dynamic).
            </p>
          </div>

          <button
            onClick={() => navigate("/cars")}
            className="hidden sm:flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-xl font-bold"
            type="button"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl p-6 shadow">Loading cars...</div>
        ) : cars.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow text-gray-600">
            No cars found (check cars table).
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => {
              const isFav = favorites.includes(car.id);
              const badge = car.badge || "Featured";
              const isAvailable = Number(car.is_available) === 1;

              return (
                <div
                  key={car.id}
                  className={`featured-card group bg-white rounded-3xl overflow-hidden shadow-md transition-all duration-500 border border-gray-100
                    ${isAvailable ? "hover:shadow-2xl hover:-translate-y-2" : "opacity-60"}`}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {car.cars_image ? (
                      <img
                        src={`http://localhost:1000/public/${car.cars_image}`}
                        alt={car.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                    {/* Badge */}
                    <div className={`absolute top-4 left-4 ${badgeClass(badge)} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg`}>
                      {badge}
                    </div>


                    {/* Favorite */}
                    <button
                      onClick={() => toggleFavorite(car.id)}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border ${isFav
                        ? "bg-pink-500 border-pink-500 text-white scale-110"
                        : "bg-white/80 border-white/50 text-gray-700 hover:bg-white hover:scale-110"
                        }`}
                      type="button"
                    >
                      <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
                    </button>

                    {/* Hover button */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transform transition-all duration-500 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => navigate(`/cars/${car.id}`)}
                        className="w-full bg-white text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2"
                        type="button"
                      >
                        View Details <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MapPin className="w-4 h-4 text-cyan-500" />
                        <span className="font-medium">{car.city || "-"}</span>
                      </div>
                      <span className="text-gray-500 font-medium">{car.year || "-"}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {car.name}
                    </h3>

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
                          ₹{Number(
                            billingType === "PER_KM"
                              ? car.price_per_km || 0
                              : car.price_per_day || 0
                          ).toLocaleString()}
                          <span className="text-sm font-normal text-gray-500">
                            {billingType === "PER_KM" ? "/km" : "/day"}
                          </span>
                        </p>

                      </div>

                      <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-2 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-gray-900">
                          {car.rating || "0.0"}
                        </span>
                      </div>
                    </div>

                    {/* ✅ Disabled like CarsPage */}
                    <button
                      disabled={!isAvailable}
                      onClick={() => isAvailable && handleBookNow(car)}
                      className={`w-full font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-3
                        ${isAvailable
                          ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white hover:shadow-2xl transform hover:scale-105"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed opacity-70"
                        }`}
                      type="button"
                    >
                      {isAvailable ? "Book Now" : "Not Available"}
                    </button>

                    <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Instant Booking
                      </span>
                      <span>{isAvailable ? "Available" : "Not available"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* mobile view all */}
        <div className="sm:hidden mt-8">
          <button
            onClick={() => navigate("/cars")}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-xl font-bold"
            type="button"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
