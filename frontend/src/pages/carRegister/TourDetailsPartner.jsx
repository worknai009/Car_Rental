import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import carRegisterApi from "../../utils/carRegisterApi";
import { Calendar, Clock, MapPin, Edit, ArrowLeft, Info, Map, CheckCircle2, XCircle, Trash2 } from "lucide-react";

const TourDetailsPartner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchDetails = async () => {
    try {
      const res = await carRegisterApi.get(`/tours/${id}`);
      setTour(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this tour package forever?")) return;
    try {
      await carRegisterApi.delete(`/tours/${id}`);
      navigate("/car-register/tours");
    } catch (err) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) return <div className="p-10 font-black text-slate-400">Loading your package details...</div>;
  if (!tour) return <div className="p-10 text-center">Package not found.</div>;

  let images = [];
  try {
    images = typeof tour.images === 'string' ? JSON.parse(tour.images || "[]") : (Array.isArray(tour.images) ? tour.images : []);
  } catch (e) {
    images = tour.image ? [tour.image] : [];
  }

  let routes = [];
  try {
    routes = typeof tour.routes === 'string' ? JSON.parse(tour.routes || "[]") : (Array.isArray(tour.routes) ? tour.routes : []);
  } catch (e) {
    routes = tour.routes ? tour.routes.split(",").map(r => r.trim()) : [];
  }

  return (
    <div className="p-6 bg-[#fafbfc] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-xl transition-all font-bold text-slate-600">
            <ArrowLeft className="h-5 w-5" /> Back to Tours
          </button>
          <div className="flex gap-3">
             <button onClick={() => navigate(`/car-register/tours/edit/${tour.id}`)} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all shadow-lg">
              <Edit className="h-4 w-4" /> Edit Package
            </button>
            <button onClick={handleDelete} className="p-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all border border-red-200">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 p-4">
              <div className="relative h-[500px] rounded-[2rem] overflow-hidden group bg-slate-100">
                {images.length > 0 ? (
                  images.map((img, idx) => (
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
                  ))
                ) : (
                  <img src="/placeholder-tour.jpg" className="w-full h-full object-cover" alt="placeholder" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10 z-10">
                  <div className="flex gap-3 mb-4">
                    <span className={`px-4 py-1.5 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border transition-all font-bold ${
                      tour.status === 'APPROVED' ? 'bg-emerald-500/80 border-emerald-400/30' : tour.status === 'PENDING' ? 'bg-amber-500/80 border-amber-400/30' : 'bg-red-500/80 border-red-400/30'
                    }`}>
                      {tour.status}
                    </span>
                    <span className={`px-4 py-1.5 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest font-bold ${tour.is_active ? 'bg-cyan-500/80' : 'bg-slate-500/80'}`}>
                      {tour.is_active ? 'Visible Publicly' : 'Hidden from Public'}
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black text-white">{tour.title}</h1>
                </div>

                {/* Slider Controls */}
                {images.length > 1 && (
                  <>
                    <button 
                      type="button"
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-20"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-20"
                    >
                      <ArrowLeft className="h-5 w-5 rotate-180" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-10 right-10 flex gap-2 z-20">
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
                <div className="flex gap-4 mt-6 overflow-x-auto pb-2 px-2 no-scrollbar">
                  {images.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all cursor-pointer ${
                        idx === currentImageIndex ? "border-cyan-500 scale-105 shadow-md" : "border-white hover:border-slate-200"
                      }`}
                    >
                      <img src={`${import.meta.env.VITE_API_URL}${img}`} className="w-full h-full object-cover" alt={`view-${idx}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-10">
               <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
                    <Info className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Public Description</h2>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">{tour.description}</p>
              </section>

              <div className="h-px bg-slate-50"></div>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <Map className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Planned Routes</h2>
                </div>
                <div className="space-y-4">
                   <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                     {routes.map((r, i) => (
                       <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
                         <span className="w-5 h-5 bg-white flex items-center justify-center rounded-lg text-cyan-600 shadow-sm">{i+1}</span> {r}
                       </span>
                     ))}
                   </div>
                   <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 font-medium text-slate-600 leading-relaxed italic">
                     {tour.itinerary}
                   </div>
                </div>
              </section>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl text-white">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Package Pricing</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-slate-400 text-xs font-bold uppercase">Customer Price</span>
                  <span className="text-2xl font-black text-cyan-400">₹{tour.price}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-slate-400 text-xs font-bold uppercase">Tour Duration</span>
                  <span className="text-sm font-black text-white">{tour.duration}</span>
                </div>
                 <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-slate-400 text-xs font-bold uppercase">Scheduled for</span>
                  <span className="text-sm font-black text-white">{new Date(tour.tour_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                 {tour.status === 'PENDING' && (
                   <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 text-amber-700">
                     <p className="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Clock className="h-4 w-4" /> Pending Approval
                     </p>
                     <p className="text-[11px] font-bold leading-relaxed">Admin will review your package shortly. Once approved, it will be visible to all customers.</p>
                   </div>
                 )}

                 <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Travel Details</h3>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <h4 className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase mb-2"><CheckCircle2 className="h-3 w-3" /> Included</h4>
                      <p className="text-[11px] font-bold text-slate-600">{tour.inclusions}</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                      <h4 className="flex items-center gap-2 text-[10px] font-black text-red-600 uppercase mb-2"><XCircle className="h-3 w-3" /> Excluded</h4>
                      <p className="text-[11px] font-bold text-slate-600">{tour.exclusions}</p>
                    </div>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailsPartner;
