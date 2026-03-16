import React, { useEffect, useState } from "react";
import userApi from "../utils/userApi";
import { 
  Calendar, MapPin, 
  Clock, Package, 
  CheckCircle, XCircle, AlertCircle, Users
} from "lucide-react";

const TourBookingsUser = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await userApi.get("/tours/my-bookings");
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch tour bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED": return "bg-teal-100 text-teal-700 border-teal-200";
      case "COMPLETED": return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Handpicked <span className="text-cyan-600">Tours</span></h1>
            <p className="text-slate-500 mt-1 font-medium">Manage and track your adventurous journeys.</p>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
            <Package className="h-5 w-5 text-cyan-600" />
            <span className="text-slate-700 font-bold">{bookings.length} Bookings</span>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
            <MapPin className="h-20 w-20 text-slate-200 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Adventure Awaits!</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't booked any tours yet. Explore our exclusive packages to start your journey.</p>
            <a href="/tours" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-cyan-600 transition-all shadow-lg active:scale-95">Explore Tours</a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              let images = [];
              try {
                images = JSON.parse(booking.tour_images || "[]");
              } catch (e) {
                images = booking.tour_images ? [booking.tour_images] : [];
              }
              const tourImg = images[0] ? `${import.meta.env.VITE_API_URL}${images[0]}` : "/placeholder-tour.jpg";

              return (
                <div
                  key={booking.id}
                  className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col md:flex-row hover:translate-y-[-4px]"
                >
                  {/* Tour Image */}
                  <div className="md:w-64 h-48 md:h-auto overflow-hidden">
                    <img
                      src={tourImg}
                      alt={booking.tour_title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-grow p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                        {booking.tour_title}
                      </h3>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 mb-6">
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Start Date</p>
                          <p className="text-sm font-bold">{new Date(booking.start_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                         <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                          <Users className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Travelers</p>
                          <p className="text-sm font-bold">{booking.num_persons} Persons</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                         <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                          <Clock className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Duration</p>
                          <p className="text-sm font-bold">{booking.tour_duration || "Flexible"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Package Amount</span>
                        <span className="text-xl font-black text-slate-900 italic">₹{booking.total_amount}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        Booked On: {new Date(booking.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TourBookingsUser;
