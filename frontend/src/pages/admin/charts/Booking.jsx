import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    carId,
    pickupLocation,
    dropLocation,
    pickupDate,
    returnDate,
  } = state;

  const [car, setCar] = useState(null);
  const [days, setDays] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:1000/cars/${carId}`).then(res => {
      setCar(res.data);

      const d1 = new Date(pickupDate);
      const d2 = new Date(returnDate);
      setDays(Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);
    });
  }, []);



const confirmBooking = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    const res = await axios.post(
      "http://localhost:1000/bookings",
      {
        car_id: carId,
        pickup_location: pickupLocation,
        drop_location: dropLocation,
        start_date: pickupDate,
        end_date: returnDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ Booking successful
    console.log(res.data);

    navigate("/mybooking", {
      state: {
        booking: res.data,
      },
    });
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Booking failed");
  }
};


  if (!car) return null;

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Confirm Booking</h2>

      <img
        src={`http://localhost:1000/${car.cars_image}`}
        className="h-52 w-full object-cover rounded"
      />

      <p className="mt-3 text-xl">{car.name}</p>
      <p>{pickupDate} → {returnDate}</p>
      <p>{days} Days</p>
      <p className="font-bold">
        Total: ₹{days * car.price_per_day}
      </p>

      <button
        onClick={confirmBooking}
        className="mt-4 bg-red-600 text-white px-6 py-2 rounded"
      >
        Confirm Booking
      </button>
    </section>
  );
};

export default Booking;
