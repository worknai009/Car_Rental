import React, { useEffect, useState } from "react";
import ScrollReveal from "scrollreveal";
import { useNavigate } from "react-router-dom";
import userApi from "../utils/userApi";

import {
  Shield,
  Clock4,
  CreditCard,
  Headphones,
  FileBadge,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MapPin,
  Star,
} from "lucide-react";

const features = [
  {
    title: "Wide Selection of Vehicles",
    description: "Choose from a diverse range of vehicles to suit your needs.",
    icon: Users,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    title: "24/7 Customer Support",
    description: "Our dedicated support team is available around the clock.",
    icon: Headphones,
    color: "from-teal-500 to-teal-600",
  },
  {
    title: "Fast and Easy Booking",
    description: "Book your vehicle in just a few clicks.",
    icon: Clock4,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Secure Payment Options",
    description: "Safe and secure payment methods for all transactions.",
    icon: CreditCard,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Flexible Rental Terms",
    description: "Rent for as long or short as you need.",
    icon: FileBadge,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Reliable and Well-Maintained Vehicles",
    description: "All vehicles are regularly serviced and maintained.",
    icon: Shield,
    color: "from-purple-500 to-purple-600",
  },
];

const Features = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // ✅ cars list
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);

  // ✅ dynamic stats
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    avgRating: 4.9,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // -----------------------------
  // Scroll animations
  // -----------------------------
  useEffect(() => {
    const sr = ScrollReveal({
      reset: false,
      distance: "60px",
      duration: 1200,
      easing: "ease-in-out",
      opacity: 0,
      viewFactor: 0.2,
    });

    sr.reveal(".features-badge", {
      origin: "top",
      distance: "20px",
      duration: 800,
    });
    sr.reveal(".features-heading", { origin: "top", delay: 100 });
    sr.reveal(".features-description", { origin: "top", delay: 200 });
    sr.reveal(".feature-card", { origin: "bottom", interval: 100, delay: 250 });

    sr.reveal(".cars-section", {
      origin: "bottom",
      distance: "40px",
      delay: 200,
    });
    sr.reveal(".car-card", { origin: "bottom", interval: 90, delay: 200 });

    sr.reveal(".cta-banner", {
      origin: "bottom",
      distance: "40px",
      delay: 250,
    });
  }, []);

  // -----------------------------
  // ✅ Fetch cars + stats
  // -----------------------------
  useEffect(() => {
    const fetchCarsAndStats = async () => {
      try {
        setCarsLoading(true);
        setStatsLoading(true);

        // IMPORTANT:
        // Your backend routes are:
        // GET http://localhost:1000/cars
        // GET http://localhost:1000/cars/available
        const [carsRes, availableRes] = await Promise.all([
          userApi.get("/cars"),
          userApi.get("/cars/available"),
        ]);

        const allCars = Array.isArray(carsRes.data) ? carsRes.data : [];
        const availableCars = Array.isArray(availableRes.data)
          ? availableRes.data
          : [];

        setCars(allCars);

        const ratings = allCars
          .map((c) => Number(c.rating))
          .filter((r) => !Number.isNaN(r) && r > 0);

        const avgRating =
          ratings.length > 0
            ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
            : 4.9;

        setStats({
          totalCars: allCars.length,
          availableCars: availableCars.length,
          avgRating,
        });
      } catch (err) {
        console.error("Features cars/stats error:", err);
      } finally {
        setCarsLoading(false);
        setStatsLoading(false);
      }
    };

    fetchCarsAndStats();
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="features-badge inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>Premium Features</span>
          </div>

          <h2 className="features-heading text-4xl md:text-5xl font-black text-gray-900">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              CarHub
            </span>
            ?
          </h2>

          <p className="features-description text-lg text-gray-600 max-w-3xl mx-auto">
            Experience excellence with our comprehensive range of services
            designed to make your car rental journey seamless and memorable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="feature-card group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-transparent rounded-bl-full opacity-50" />

                  <div className="relative mb-6">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    <div
                      className={`absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center transform transition-all duration-500 ${
                        isHovered
                          ? "scale-100 opacity-100"
                          : "scale-0 opacity-0"
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="relative space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-teal-600 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>

                    <div
                      className={`flex items-center gap-2 text-sm font-semibold text-cyan-600 pt-2 transform transition-all duration-500 ${
                        isHovered
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-4 opacity-0"
                      }`}
                    >
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:to-teal-500 group-hover:text-white transition-all duration-500">
                    {index + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ CARS SECTION (Dynamic - Only 6 Cars) */}
        <div className="cars-section mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900">
              Latest Cars
            </h3>
            <button
              onClick={() => navigate("/cars")}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {carsLoading ? (
            <div className="bg-white rounded-2xl p-6 shadow">Loading cars...</div>
          ) : cars.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow text-gray-600">
              No cars found. Add cars from admin panel.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...cars]
                .sort((a, b) => Number(b.id) - Number(a.id)) // ✅ latest first
                .slice(0, 6) // ✅ only 6 cars
                .map((c) => (
                  <div
                    key={c.id}
                    className="car-card bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden border"
                  >
                    <div className="h-44 bg-gray-100">
                      {c.cars_image ? (
                        <img
                          src={`http://localhost:1000/public/${c.cars_image}`}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-black text-lg text-gray-900">
                            {c.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {c.brand} • {c.category_name || "Category"}
                          </p>
                        </div>

                        {c.badge ? (
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100">
                            {c.badge}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                        {c.city ? (
                          <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            <MapPin className="w-3 h-3" /> {c.city}
                          </span>
                        ) : null}
                        {c.seats ? (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {c.seats} seats
                          </span>
                        ) : null}
                        {c.fuel_type ? (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {c.fuel_type}
                          </span>
                        ) : null}
                        {c.year ? (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {c.year}
                          </span>
                        ) : null}
                        {c.rating ? (
                          <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            <Star className="w-3 h-3" /> {c.rating}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-lg font-black text-gray-900">
                          ₹{c.price_per_day}{" "}
                          <span className="text-sm font-medium text-gray-500">
                            /day
                          </span>
                        </div>

                        <button
                          onClick={() => navigate(`/cars/${c.id}`)}
                          className="text-sm font-bold text-cyan-700 hover:text-cyan-800"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* CTA Banner */}
        <div className="cta-banner relative">
          <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Ready to Experience Excellence?
                </h3>
                <p className="text-white/90 text-lg mb-6 md:mb-0">
                  Browse our fleet and book your next ride in minutes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/cars")}
                  className="group bg-white text-cyan-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Browse Cars</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                <button
                  onClick={() => navigate("/contact")}
                  className="bg-black/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold hover:bg-black/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
                >
                  Contact Us
                </button>
              </div>
            </div>

            {/* ✅ Dynamic Stats */}
            <div className="relative grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-1">
                  {statsLoading ? "..." : `${stats.totalCars}+`}
                </div>
                <div className="text-white/80 text-sm font-medium">
                  Vehicles
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-1">
                  {statsLoading ? "..." : `${stats.availableCars}+`}
                </div>
                <div className="text-white/80 text-sm font-medium">
                  Available Now
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-1">
                  {statsLoading ? "..." : `${stats.avgRating}★`}
                </div>
                <div className="text-white/80 text-sm font-medium">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-gray-600">
          {[
            "No Hidden Fees",
            "Free Cancellation",
            "Instant Confirmation",
            "Best Price Guarantee",
          ].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-medium">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
