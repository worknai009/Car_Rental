import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Car, ArrowRight } from "lucide-react";

const Cars = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ SAFE ACCESS
  const {
    pickupLocation,
    dropLocation,
    pickupDate,
    returnDate,
  } = location.state || {};

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚨 If user opens /cars directly
  useEffect(() => {
    if (!pickupDate || !returnDate) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:1000/cars/available", {
        params: {
          start_date: pickupDate,
          end_date: returnDate,
        },
      })
      .then(res => setCars(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [pickupDate, returnDate, navigate]);

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Loading cars...
      </p>
    );
  }

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 flex gap-2">
        <Car className="text-red-600" /> Available Cars
      </h2>

      {cars.length === 0 && (
        <p className="text-center text-gray-500">
          No cars available for selected dates
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cars.map(car => (
          <div
            key={car.id}
            className="border p-4 rounded bg-white hover:shadow-lg transition"
          >
            <img
              src={`http://localhost:1000/${car.cars_image}`}
              alt={car.name}
              className="h-40 w-full object-cover rounded"
            />

            <h3 className="text-xl mt-2 font-semibold">
              {car.name}
            </h3>

            <p className="text-red-600 font-bold">
              ₹{car.price_per_day}/day
            </p>

            <button
              onClick={() =>
                navigate("/booking", {
                  state: {
                    carId: car.id,
                    pickupLocation,
                    dropLocation,
                    pickupDate,
                    returnDate,
                  },
                })
              }
              className="mt-3 text-red-600 flex gap-1 items-center"
            >
              Book Now <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cars;
