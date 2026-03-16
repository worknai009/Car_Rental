import React, { useEffect, useState } from "react";
import {
  Box, IconButton, Typography, useTheme,
  Button, Card, CardMedia, CardContent,
  CardActions, Grid, Chip, Tooltip
} from "@mui/material";
import { Edit, Delete, Plus, Eye, Check, X, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../utils/adminApi";
import Header from "../../components/admin/Header";
import { Tabs, Tab, Divider } from "@mui/material";

const ToursList = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/admin/tours/packages");
      setTours(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminApi.put(`/admin/tours/packages/${id}`, { status });
      setTours(tours.map(t => t.id === id ? { ...t, status } : t));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleToggleActive = async (id, is_active) => {
    try {
      await adminApi.put(`/admin/tours/packages/${id}`, { is_active: is_active ? 1 : 0 });
      setTours(tours.map(t => t.id === id ? { ...t, is_active: is_active ? 1 : 0 } : t));
    } catch (err) {
      console.error(err);
      alert("Failed to update visibility");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await adminApi.delete(`/admin/tours/packages/${id}`);
      setTours(tours.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete tour");
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const filteredTours = tabValue === 0 
    ? tours.filter(t => t.status === 'APPROVED') 
    : tours.filter(t => t.status === 'PENDING');

  if (loading) return <div className="p-8 font-bold text-slate-400">Loading tour database...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">Tours Management</h1>
          <p className="text-slate-500 text-sm font-medium">Approve partner requests and manage active packages</p>
        </div>
        <button
          onClick={() => navigate("/admin/tours/add")}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-cyan-600 transition-all shadow-lg hover:shadow-cyan-100"
        >
          <Plus className="h-5 w-5" />
          Create Direct Tour
        </button>
      </div>

      <div className="bg-white p-1 rounded-2xl inline-flex border border-slate-100 shadow-sm">
        <button 
          onClick={() => setTabValue(0)}
          className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${tabValue === 0 ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Manage Tours ({tours.filter(t => t.status === 'APPROVED').length})
        </button>
        <button 
          onClick={() => setTabValue(1)}
          className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${tabValue === 1 ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Partner Requests ({tours.filter(t => t.status === 'PENDING').length})
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-5">
        {filteredTours.length === 0 ? (
          <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center">
            <Typography variant="h6" className="text-slate-400 font-black">No {tabValue === 0 ? 'active tours' : 'pending requests'} found.</Typography>
          </div>
        ) : (
          filteredTours.map((tour) => {
            let images = [];
            try { images = JSON.parse(tour.images || "[]"); } catch (e) {}
            const cover = images[0] ? `${import.meta.env.VITE_API_URL}${images[0]}` : "/placeholder-tour.jpg";

            return (
              <div key={tour.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col hover:-translate-y-1">
                <div className="relative h-40">
                  <img src={cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={tour.title} />
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                    <div className="px-2.5 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest backdrop-blur-md bg-slate-900/80">
                      ID: #{tour.id}
                    </div>
                    <button 
                      onClick={() => handleToggleActive(tour.id, !tour.is_active)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest backdrop-blur-md transition-all ${
                        tour.is_active ? 'bg-emerald-500/90 hover:bg-emerald-600' : 'bg-slate-500/90 hover:bg-slate-600'
                      }`}
                    >
                      {tour.is_active ? 'Visible' : 'Hidden'}
                    </button>
                    {tour.created_by_role === 'CAR_REGISTER' && (
                      <div className="px-2.5 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest bg-cyan-600/90 backdrop-blur-md">
                        Partner
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-black text-slate-900 leading-tight mb-1 line-clamp-1">{tour.title}</h3>
                  <div className="flex flex-wrap gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {tour.duration}</span>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                      <span className="text-slate-400 text-[10px] block font-bold">Package Price</span>
                      <span className="text-xl font-black text-cyan-600">₹{tour.price}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <div className="flex gap-1">
                      {tour.status === 'PENDING' ? (
                        <>
                          <button onClick={() => handleUpdateStatus(tour.id, 'APPROVED')} className="p-2 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200 transition-all shadow-sm" title="Approve">
                            <Check size={16} strokeWidth={3} />
                          </button>
                          <button onClick={() => handleUpdateStatus(tour.id, 'REJECTED')} className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all shadow-sm" title="Reject">
                            <X size={16} strokeWidth={3} />
                          </button>
                        </>
                      ) : null}
                    </div>
                    
                    <div className="flex gap-1">
                      <button onClick={() => navigate(`/admin/tours/${tour.id}`)} className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all" title="View Details">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button onClick={() => navigate(`/admin/tours/edit/${tour.id}`)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all" title="Edit">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(tour.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                        <Delete className="h-5 w-5" />
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

export default ToursList;
