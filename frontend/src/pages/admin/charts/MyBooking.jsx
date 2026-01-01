import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState({}); // store feedback per booking
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:1000/mybookings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load bookings");
      });
  }, [navigate]);

  // Update feedback state
  const handleFeedbackChange = (bookingId, field, value) => {
    setFeedbacks((prev) => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], [field]: value },
    }));
  };

  // Submit feedback
  const submitFeedback = async (bookingId) => {
    const token = localStorage.getItem("token");
    const feedback = feedbacks[bookingId];

    if (!feedback || !feedback.message || !feedback.rating) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:1000/feedback",
        {
          message: feedback.message,
          rating: feedback.rating,
          booking_id: bookingId, // send booking_id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Feedback submitted successfully");
      setFeedbacks((prev) => ({ ...prev, [bookingId]: {} })); // reset form
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="border rounded-lg p-4 mb-6">
            <div className="flex gap-4">
              <img
                src={`http://localhost:1000/${b.cars_image}`}
                className="w-40 h-28 object-cover rounded"
                alt={b.car_name}
              />

              <div className="flex-1">
                <h3 className="text-xl font-semibold">{b.car_name}</h3>
                <p>
                  {b.start_date} → {b.end_date}
                </p>
                <p>
                  {b.pickup_location} → {b.drop_location}
                </p>
                <p className="font-bold">₹ {b.total_amount}</p>

                <span className="text-sm text-green-600 block mb-2">
                  Status: {b.status}
                </span>

                <button
                  onClick={() => navigate(`/invoice/${b.id}`)}
                  className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800"
                >
                  View Invoice
                </button>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold mb-2">Give Feedback</h4>
              <textarea
                placeholder="Write your feedback"
                className="w-full border p-2 rounded mb-2"
                value={feedbacks[b.id]?.message || ""}
                onChange={(e) =>
                  handleFeedbackChange(b.id, "message", e.target.value)
                }
              />
              <select
                className="w-full border p-2 rounded mb-2"
                value={feedbacks[b.id]?.rating || ""}
                onChange={(e) =>
                  handleFeedbackChange(b.id, "rating", e.target.value)
                }
              >
                <option value="">Select Rating</option>
                <option value="1">1 ⭐</option>
                <option value="2">2 ⭐⭐</option>
                <option value="3">3 ⭐⭐⭐</option>
                <option value="4">4 ⭐⭐⭐⭐</option>
                <option value="5">5 ⭐⭐⭐⭐⭐</option>
              </select>
              <button
                onClick={() => submitFeedback(b.id)}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;
