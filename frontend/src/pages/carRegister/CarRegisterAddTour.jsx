import React, { useState, useEffect } from "react";
import carRegisterApi from "../../utils/carRegisterApi";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, Upload
} from "lucide-react";

const CarRegisterAddTour = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    itinerary: "",
    inclusions: "",
    exclusions: "",
    tour_date: "",
    tour_time: "",
    routes: "",
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (isEdit) {
      const fetchTour = async () => {
        try {
          const res = await carRegisterApi.get(`/tours/${id}`);
          const tour = res.data;
          
          let routesStr = "";
          if (tour.routes) {
            try {
              const routesArr = typeof tour.routes === 'string' ? JSON.parse(tour.routes) : tour.routes;
              routesStr = Array.isArray(routesArr) ? routesArr.join(", ") : tour.routes;
            } catch (e) {
              routesStr = tour.routes;
            }
          }

          setFormData({
            title: tour.title || "",
            description: tour.description || "",
            duration: tour.duration || "",
            price: tour.price || "",
            itinerary: tour.itinerary || "",
            inclusions: tour.inclusions || "",
            exclusions: tour.exclusions || "",
            tour_date: tour.tour_date ? tour.tour_date.slice(0, 10) : "",
            tour_time: tour.tour_time || "",
            routes: routesStr,
          });
          
          try {
            const imgs = typeof tour.images === 'string' ? JSON.parse(tour.images || "[]") : tour.images;
            setExistingImages(Array.isArray(imgs) ? imgs : []);
          } catch (e) {
            setExistingImages([]);
          }
        } catch (err) {
          console.error("Fetch Tour Err:", err);
          const msg = err.response?.data?.message || "Failed to fetch tour details";
          alert(msg);
        }
      };
      fetchTour();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'routes') {
        const routesArr = formData.routes.split(",").map(r => r.trim()).filter(Boolean);
        data.append(key, JSON.stringify(routesArr));
      } else {
        data.append(key, formData[key]);
      }
    });
    
    images.forEach(img => data.append("images", img));

    try {
      if (isEdit) {
        await carRegisterApi.put(`/tours/${id}`, data);
        alert("Tour updated successfully! ✅");
      } else {
        await carRegisterApi.post("/tours", data);
        alert("Tour submitted for approval! ✅");
      }
      navigate("/car-register/tours");
    } catch (err) {
      console.error(err);
      alert(isEdit ? "Failed to update tour" : "Failed to submit tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
       <button 
        onClick={() => navigate("/car-register/tours")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tours
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-8 text-white">
          <h1 className="text-3xl font-black">{isEdit ? "Edit Tour" : "Add New Tour"}</h1>
          <p className="text-white/80 font-medium">
            {isEdit ? "Update your tour details below." : "Create a premium experience for our travelers."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Tour Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-cyan-500 outline-none transition-all font-bold" placeholder="e.g. Magical Kerala Backwaters" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Duration</label>
              <input type="text" name="duration" required value={formData.duration} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-cyan-500 outline-none transition-all font-bold" placeholder="e.g. 3 Days / 2 Nights" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Price (₹)</label>
              <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-cyan-500 outline-none transition-all font-bold" placeholder="9999" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Tour Date</label>
              <input type="date" name="tour_date" required value={formData.tour_date} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-cyan-500 outline-none transition-all font-bold" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Departure Time</label>
              <input type="time" name="tour_time" required value={formData.tour_time} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-cyan-500 outline-none transition-all font-bold" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Short Description</label>
              <textarea name="description" required rows="3" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-cyan-500 outline-none transition-all font-bold" placeholder="Describe the tour briefly..." />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Travel Routes (Comma separated)</label>
              <input type="text" name="routes" value={formData.routes} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-cyan-500 outline-none transition-all font-bold" placeholder="Airport, City Center, Hill Station..." />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Detailed Itinerary</label>
              <textarea name="itinerary" rows="5" value={formData.itinerary} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-cyan-500 outline-none transition-all font-bold" placeholder="Describe the day-wise plan..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Inclusions</label>
              <textarea name="inclusions" rows="4" value={formData.inclusions} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all font-bold" placeholder="What's included?" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Exclusions</label>
              <textarea name="exclusions" rows="4" value={formData.exclusions} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-red-500 outline-none transition-all font-bold" placeholder="What's not included?" />
            </div>

            {isEdit && existingImages.length > 0 && (
              <div className="md:col-span-2 space-y-4">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">Current Images</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm relative group">
                      <img 
                        src={`${import.meta.env.VITE_API_URL}${img}`} 
                        className="w-full h-full object-cover" 
                        alt={`Tour ${idx}`}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-[10px] font-black uppercase tracking-wider">Stored</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="md:col-span-2 space-y-4 pt-4">
               <label className="text-sm font-black text-slate-700 uppercase tracking-widest pl-1">
                 {isEdit ? "Upload New Images (Will replace existing)" : "Images (Multiple)"}
               </label>
               <div className="relative group cursor-pointer">
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" 
                  />
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center group-hover:border-cyan-500 transition-all">
                    <Upload className="h-10 w-10 text-slate-300 mx-auto mb-4 group-hover:text-cyan-500" />
                    <p className="font-bold text-slate-500">
                      {images.length > 0 ? `${images.length} files selected` : "Drag & drop images here or click to browse"}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8">
            <button type="button" onClick={() => navigate("/car-register/tours")} className="px-8 py-4 text-slate-500 font-bold hover:text-slate-900 transition-colors">Cancel</button>
            <button disabled={loading} type="submit" className="px-12 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:shadow-cyan-100 hover:bg-cyan-600 transition-all disabled:opacity-50">
              {loading ? (isEdit ? "Updating..." : "Submitting...") : (isEdit ? "Update Package" : "Submit Package")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarRegisterAddTour;
