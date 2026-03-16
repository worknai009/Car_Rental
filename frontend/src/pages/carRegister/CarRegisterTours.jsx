import React, { useEffect, useState } from "react";
import carRegisterApi from "../../utils/carRegisterApi";
import { Link } from "react-router-dom";
import { Plus, Trash2, Clock, Calendar, CheckCircle, XCircle, Eye, Edit } from "lucide-react";

const CarRegisterTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = async () => {
    try {
      const res = await carRegisterApi.get("/tours");
      setTours(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await carRegisterApi.delete(`/tours/${id}`);
      setTours(tours.filter(t => t.id !== id));
    } catch (err) {
      alert("Failed to delete tour");
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  if (loading) return <div className="p-8 font-bold text-slate-400">Loading your tours...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Tour Packages</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and monitor your tour offerings</p>
        </div>
        <Link 
          to="/car-register/tours/add"
          className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-bold rounded-2xl hover:bg-cyan-700 transition-all shadow-lg hover:shadow-cyan-200"
        >
          <Plus className="h-5 w-5" />
          Create New Package
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {tours.length === 0 ? (
          <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center">
            <p className="text-slate-400 font-bold">You haven't added any tours yet.</p>
          </div>
        ) : (
          tours.map(tour => {
            let images = [];
            try { 
              images = typeof tour.images === 'string' ? JSON.parse(tour.images || "[]") : (Array.isArray(tour.images) ? tour.images : []);
            } catch (e) {
              images = tour.image ? [tour.image] : [];
            }
            const cover = images[0] ? `${import.meta.env.VITE_API_URL}${images[0]}` : "/placeholder-tour.jpg";

            return (
              <div key={tour.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col hover:-translate-y-1">
                <div className="relative h-40">
                  <img src={cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={tour.title} />
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                    <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest backdrop-blur-md ${
                      tour.status === 'APPROVED' ? 'bg-emerald-500/90' : tour.status === 'PENDING' ? 'bg-amber-500/90' : 'bg-red-500/90'
                    }`}>
                      {tour.status}
                    </div>
                    {tour.is_active ? (
                      <div className="px-2.5 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest bg-cyan-500/90 backdrop-blur-md">
                        Visible
                      </div>
                    ) : (
                      <div className="px-2.5 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest bg-slate-500/90 backdrop-blur-md">
                        Hidden
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-black text-slate-900 leading-tight mb-1 line-clamp-1">{tour.title}</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-3">ID: #{tour.id}</p>
                  
                  <div className="flex flex-wrap gap-3 text-slate-500 text-[11px] font-bold mb-4">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-cyan-500" /> {tour.duration}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-cyan-500" /> {new Date(tour.tour_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                      <span className="text-slate-400 text-[10px] block font-bold">Package Price</span>
                      <span className="text-xl font-black text-cyan-600">₹{tour.price}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Link 
                        to={`/car-register/tours/${tour.id}`}
                        className="p-2.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-2xl transition-all"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link 
                        to={`/car-register/tours/edit/${tour.id}`}
                        className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-2xl transition-all"
                        title="Edit Package"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(tour.id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                        title="Delete Package"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CarRegisterTours;
