import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:1000/mybookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => setBookings(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to load bookings");
      });
  }, [navigate]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map(b => (
          <div
            key={b.id}
            className="border rounded-lg p-4 mb-4 flex gap-4"
          >
            <img
              src={`http://localhost:1000/${b.cars_image}`}
              className="w-40 h-28 object-cover rounded"
              alt={b.car_name}
            />

            <div className="flex-1">
              <h3 className="text-xl font-semibold">{b.car_name}</h3>
              <p>{b.start_date} → {b.end_date}</p>
              <p>{b.pickup_location} → {b.drop_location}</p>
              <p className="font-bold">₹ {b.total_amount}</p>

              <span className="text-sm text-green-600 block mb-2">
                Status: {b.status}
              </span>

              {/* ✅ View Invoice Button */}
              <button
                onClick={() => navigate(`/invoice/${b.id}`)}
                className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
              >
                View Invoice
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;
