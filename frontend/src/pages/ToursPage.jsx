import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userApi from "../utils/userApi";
import { Calendar, Clock, MapPin, ArrowRight, Package } from "lucide-react";

const ToursPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await userApi.get("/tours/packages");
        setTours(res.data);
      } catch (err) {
        console.error("Failed to fetch tours:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Exclusive <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Tour Packages</span>
            </h1>
            <p className="text-slate-600 max-w-2xl text-lg font-medium">
              Discover breathtaking destinations with our handpicked packages.
            </p>
          </div>
          
          {localStorage.getItem("token") && (
             <Link 
              to="/my-tours" 
              className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-black shadow-sm hover:shadow-lg hover:border-cyan-200 transition-all active:scale-95"
            >
              <Package className="h-5 w-5 text-cyan-600" />
              My Booked Tours
            </Link>
          )}
        </div>

        {/* Tours Grid */}
        {tours.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200">
            <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No tours available right now</h3>
            <p className="text-slate-500">Check back later for new adventurous packages!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  {(() => {
                    let images = [];
                    try {
                      images = JSON.parse(tour.images || "[]");
                    } catch (e) {
                      images = tour.image ? [tour.image] : [];
                    }
                    const coverImage = images[0] ? `${import.meta.env.VITE_API_URL}${images[0]}` : "/placeholder-tour.jpg";

                    return (
                      <img
                        src={coverImage}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    );
                  })()}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/50">
                    <span className="text-lg font-bold text-cyan-600">₹{tour.price}</span>
                    <span className="text-xs text-slate-500 ml-1">/ person</span>
                  </div>
                  {tour.created_by_role === 'CAR_REGISTER' && (
                    <div className="absolute top-4 left-4 bg-cyan-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                      Partner Tour
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow text-slate-800">
                  <div className="flex flex-wrap items-center gap-2 mb-4 whitespace-nowrap overflow-hidden">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold uppercase tracking-wider">
                      <Clock className="h-3 w-3" />
                      {tour.duration}
                    </div>
                    {tour.tour_date && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Calendar className="h-3 w-3" />
                        {new Date(tour.tour_date).toLocaleDateString()}
                      </div>
                    )}
                    {tour.tour_time && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Clock className="h-3 w-3" />
                        {tour.tour_time}
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors">
                    {tour.title}
                  </h2>

                  <p className="text-slate-600 line-clamp-3 mb-6 text-sm flex-grow">
                    {tour.description}
                  </p>

                  <Link
                    to={`/tours/${tour.id}`}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-cyan-600 transition-all duration-300 shadow-lg group-hover:translate-y-[-4px]"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToursPage;
