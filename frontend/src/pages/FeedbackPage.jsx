import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import userApi from "../utils/userApi";

export default function FeedbackPage() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const booking_id = sp.get("booking_id");
  const car_id = sp.get("car_id");

  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!booking_id || !car_id) return alert("Missing booking/car info");

    await userApi.post("/feedback", {
      booking_id: Number(booking_id),
      car_id: Number(car_id),
      rating: Number(rating),
      message,
    });

    alert("Thanks for your feedback ✅");
    navigate("/my-bookings");
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-black mb-4">Rate Your Ride</h2>

        <label className="font-bold">Rating</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full border p-3 rounded-xl mt-2">
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <label className="font-bold mt-4 block">Feedback</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-3 rounded-xl mt-2"
          rows={4}
          placeholder="Write your feedback..."
        />

        <button onClick={submit} className="w-full mt-5 py-3 rounded-xl bg-cyan-600 text-white font-bold">
          Submit
        </button>
      </div>
    </div>
  );
}
