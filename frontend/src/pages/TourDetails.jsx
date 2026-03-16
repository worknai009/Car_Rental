import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userApi from "../utils/userApi";
import {
  Calendar, Clock, MapPin,
  CheckCircle2, XCircle, Users,
  ArrowLeft, ShieldCheck, Map,
  Info, Sparkles, Star
} from "lucide-react";

/**
 * 🌟 TourDetails Component
 * Redesigned with a premium, immersive look.
 * Removed "Start Date" as it now uses the tour's own scheduled date.
 */
const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numPersons, setNumPersons] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const res = await userApi.get(`/tours/packages/${id}`);
        setTour(res.data);
      } catch (err) {
        console.error("Failed to fetch tour details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTourDetails();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    setBookingLoading(true);
    try {
      // ✅ Automatically use tour_date from the tour object
      await userApi.post("/tours/book", {
        tour_id: id,
        booking_date: new Date().toISOString().split("T")[0],
        start_date: tour.tour_date,
        num_persons: numPersons,
        total_amount: tour.price * numPersons,
      });
      alert("Tour booked successfully! Check 'My Tours' for status. ✅");
      navigate("/my-tours");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-100 rounded-full"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6">
          <Info className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Tour Missing</h2>
        <p className="text-slate-500 mt-2 mb-8">This exploration might have been moved or removed.</p>
        <button
          onClick={() => navigate("/tours")}
          className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-cyan-100 hover:scale-105 transition-all"
        >
          Back to Tours
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-10 pb-24">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-cyan-50/50 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-50/50 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation / Header Area */}
        <div className="flex items-center justify-between mb-10">


          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm divide-x divide-slate-100">
            <span className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Premium
            </span>
            <span className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest pl-3">
              <Star className="h-3.5 w-3.5 text-cyan-500 fill-cyan-500" /> 4.9 Tour
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Visual Gallery Card */}
            <div className="bg-white rounded-[3.5rem] p-4 sm:p-6 shadow-sm border border-slate-100">
              {(() => {
                let images = [];
                try {
                  images = JSON.parse(tour.images || "[]");
                } catch (e) {
                  images = tour.image ? [tour.image] : [];
                }

                return (
                  <div className="space-y-6">
                    {/* Immersive Image Slider */}
                    <div className="relative group rounded-[3rem] overflow-hidden shadow-2xl bg-white aspect-[16/10]">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                            idx === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none"
                          }`}
                        >
                          <img
                            src={`${import.meta.env.VITE_API_URL}${img}`}
                            alt={`${tour.title} - ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}

                      {/* Overlay Content */}
                      <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10">
                        <div className="flex flex-wrap gap-3 mb-6">
                          <span className="px-5 py-2 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full text-xs font-black uppercase tracking-widest">
                            {tour.duration}
                          </span>
                          {tour.tour_date && (
                            <span className="px-5 py-2 bg-cyan-500/80 backdrop-blur-md text-white rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5" /> {new Date(tour.tour_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight drop-shadow-lg">
                          {tour.title}
                        </h1>
                      </div>

                      {/* Slider Controls */}
                      {images.length > 1 && (
                        <>
                          <button 
                            type="button"
                            onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-20"
                          >
                            <ArrowLeft className="h-6 w-6" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-20"
                          >
                            <ArrowLeft className="h-6 w-6 rotate-180" />
                          </button>

                          {/* Indicators */}
                          <div className="absolute bottom-12 right-12 flex gap-2 z-20">
                            {images.map((_, idx) => (
                              <div
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                                  idx === currentImageIndex ? "w-8 bg-cyan-500" : "w-2 bg-white/30 hover:bg-white/50"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Strip */}
                    {images.length > 1 && (
                      <div className="flex gap-4 px-2 overflow-x-auto pb-4 no-scrollbar">
                        {images.map((img, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all cursor-pointer ${
                              idx === currentImageIndex ? "border-cyan-500 scale-105 shadow-lg" : "border-white hover:border-slate-200"
                            }`}
                          >
                            <img src={`${import.meta.env.VITE_API_URL}${img}`} className="w-full h-full object-cover" alt={`view-${idx}`} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 gap-10 bg-white rounded-[3.5rem] p-8 sm:p-12 shadow-sm border border-slate-100">
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Overview</h2>
                </div>
                <p className="text-slate-500 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                  {tour.description}
                </p>
              </section>

              <div className="h-px bg-slate-50"></div>

              {/* Travel Routes Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <Map className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Travel Routes</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(() => {
                    let routes = [];
                    try {
                      routes = JSON.parse(tour.routes || "[]");
                    } catch (e) {
                      routes = tour.routes ? tour.routes.split(",").map(r => r.trim()) : [];
                    }
                    if (routes.length === 0) return <p className="text-slate-400 italic">No specific routes mentioned.</p>;

                    return routes.map((route, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-cyan-600 font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-slate-700 font-bold">{route}</span>
                      </div>
                    ));
                  })()}
                </div>
              </section>

              <div className="h-px bg-slate-50"></div>

              <section className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <div className="w-2 h-8 bg-cyan-600 rounded-full"></div>
                  The Experience
                </h2>
                <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 hover:border-cyan-100 transition-colors">
                  <p className="text-slate-600 whitespace-pre-wrap leading-relaxed font-medium">
                    {tour.itinerary}
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-8 bg-emerald-50/30 rounded-3xl border border-emerald-100/50">
                  <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    Inclusions
                  </h3>
                  <div className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed font-medium">
                    {tour.inclusions}
                  </div>
                </div>

                <div className="p-8 bg-red-50/30 rounded-3xl border border-red-100/50">
                  <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                      <XCircle className="h-5 w-5" />
                    </div>
                    Exclusions
                  </h3>
                  <div className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed font-medium">
                    {tour.exclusions}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Booking (Right) */}
          <div className="lg:col-span-4 lg:sticky lg:top-36 h-fit">
            <div className="relative isolate overflow-hidden bg-slate-900 rounded-[3rem] p-10 shadow-2xl">
              {/* Decorative shapes for sidebar */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl -z-10"></div>

              <div className="space-y-8">
                <div>
                  <span className="text-slate-400 text-xs font-black uppercase tracking-widest block mb-4">Invest in memories</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">₹{tour.price || 0}</span>
                    <span className="text-slate-500 text-sm font-bold">/ person</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Departure</span>
                    <span className="text-white text-sm font-bold block">
                      {tour.tour_date ? new Date(tour.tour_date).toLocaleDateString() : 'Flexible'}
                    </span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Time</span>
                    <span className="text-white text-sm font-bold block">{tour.tour_time || '09:00 AM'}</span>
                  </div>
                </div>

                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Travelers</label>
                    <div className="relative group">
                      <Users className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="number"
                        min="1"
                        required
                        value={numPersons}
                        onChange={(e) => setNumPersons(parseInt(e.target.value) || 1)}
                        className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-2xl pl-14 pr-6 py-5 text-white font-black text-lg outline-none transition-all focus:bg-white/10"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Total Amount</span>
                      <span className="text-3xl font-black text-white">₹{(tour.price || 0) * numPersons}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full py-5 bg-cyan-600 text-white font-black text-lg rounded-2xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/40 active:scale-95 disabled:opacity-50"
                    >
                      {bookingLoading ? "Processing..." : "Reserve Now"}
                    </button>
                  </div>
                </form>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                    <Info className="h-5 w-5 text-cyan-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                    By reserving, you accept our premium terms. A Travel Specialist will contact you shortly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
