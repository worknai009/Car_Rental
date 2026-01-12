import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import userApi from "../utils/userApi";
import { Car, MapPin, Calendar, ArrowRight, Loader2 } from "lucide-react";

const ReviewBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // ✅ NEVER name it car_id in React component
  const carId = searchParams.get("car_id");

  const pickupFromUrl = searchParams.get("pickup_location") || "";
  const dropFromUrl = searchParams.get("drop_location") || "";
  const startDateFromUrl = searchParams.get("start_date") || "";
  const startTimeFromUrl = searchParams.get("start_time") || "";
  const endDateFromUrl = searchParams.get("end_date") || "";

  // car can come from navigate state (CarsPage), but it will be LOST on refresh
  const carFromState = location.state?.car || null;

  const [car, setCar] = useState(carFromState);
  const [loadingCar, setLoadingCar] = useState(!carFromState);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    pickup_location: pickupFromUrl,
    drop_location: dropFromUrl,
    start_date: startDateFromUrl,
    end_date: endDateFromUrl,
  });

  // Keep form synced if URL changes
  useEffect(() => {
    setForm({
      pickup_location: pickupFromUrl,
      drop_location: dropFromUrl,
      start_date: startDateFromUrl,
      end_date: endDateFromUrl,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupFromUrl, dropFromUrl, startDateFromUrl, endDateFromUrl]);

  // ✅ If user opens /review-booking directly (or refresh), fetch car by id
  useEffect(() => {
    const fetchCar = async () => {
      if (carFromState) return;
      if (!carId) return;

      try {
        setLoadingCar(true);
        const res = await userApi.get(`/cars/${carId}`);
        setCar(res.data || null);
      } catch (err) {
        console.error("Fetch car by id error:", err);
        setCar(null);
      } finally {
        setLoadingCar(false);
      }
    };

    fetchCar();
  }, [carId, carFromState]);

  // Guard: if car_id missing
  useEffect(() => {
    if (!carId) {
      navigate("/cars", { replace: true });
    }
  }, [carId, navigate]);

  const days = useMemo(() => {
    if (!form.start_date || !form.end_date) return 1;
    const s = new Date(form.start_date);
    const e = new Date(form.end_date);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  }, [form.start_date, form.end_date]);

  const total = useMemo(() => {
    const price = Number(car?.price_per_day || 0);
    return price * days;
  }, [car?.price_per_day, days]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleConfirmBooking = async () => {
    if (!carId) return alert("Car ID missing!");
    if (!form.pickup_location || !form.drop_location || !form.start_date || !form.end_date) {
      return alert("Please fill all booking details.");
    }

    try {
      setSaving(true);

      // ✅ Backend expects:
      // car_id, pickup_location, drop_location, start_date, end_date
      const payload = {
        car_id: Number(carId),
        pickup_location: form.pickup_location,
        drop_location: form.drop_location,
        start_date: form.start_date,
        end_date: form.end_date,
      };

      const res = await userApi.post("/bookings/booking", payload);

      alert(`Booking Created ✅\nBooking ID: ${res.data?.booking_id || ""}`);

      // ✅ go to My Bookings (recommended)
      navigate("/my-bookings");
    } catch (err) {
      console.error("Create booking error:", err);
      alert(err?.response?.data?.message || "Booking failed");
    } finally {
      setSaving(false);
    }
  };

  if (loadingCar) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-3 text-gray-700">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading car details...
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-6 rounded-2xl shadow max-w-md w-full text-center">
          <h2 className="text-xl font-black text-gray-900 mb-2">Car not found</h2>
          <p className="text-gray-600 mb-4">
            This car may be removed or the URL is invalid.
          </p>
          <button
            onClick={() => navigate("/cars")}
            className="px-6 py-3 rounded-xl bg-gray-900 text-white font-bold"
          >
            Back to Cars
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = car?.cars_image ? `http://localhost:1000/public/${car.cars_image}` : "";

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Car Card */}
        <div className="bg-white rounded-3xl shadow border overflow-hidden">
          <div className="h-60 bg-gray-100">
            {imageUrl ? (
              <img src={imageUrl} alt={car.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{car.city || "-"}</span>
            </div>

            <h1 className="text-2xl font-black text-gray-900">{car.name}</h1>
            <p className="text-gray-600">{car.brand} • {car.category_name || "Category"}</p>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <div className="text-xs text-gray-500 font-semibold">Price / day</div>
                <div className="text-2xl font-black text-gray-900">
                  ₹{Number(car.price_per_day || 0).toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500 font-semibold">Trip days</div>
                <div className="text-2xl font-black text-gray-900">{days}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">Estimated Total</div>
              <div className="text-2xl font-black text-gray-900">
                ₹{Number(total || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Booking Form */}
        <div className="bg-white rounded-3xl shadow border p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Car className="w-6 h-6 text-cyan-600" />
            <h2 className="text-2xl font-black text-gray-900">Review Booking</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pickup Location</label>
              <input
                name="pickup_location"
                value={form.pickup_location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none"
                placeholder="Enter pickup location"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Drop Location</label>
              <input
                name="drop_location"
                value={form.drop_location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none"
                placeholder="Enter drop location"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* (Optional) show start time from URL */}
            {startTimeFromUrl ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                Start Time: <span className="font-bold text-gray-900">{startTimeFromUrl}</span>
              </div>
            ) : null}
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={saving}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-black shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Booking...
              </>
            ) : (
              <>
                Confirm Booking <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewBookingPage;
