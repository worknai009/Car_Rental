import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Invoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:1000/bookings/${id}/invoice`)
      .then(res => setInvoice(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!invoice) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 border rounded">
      <h2 className="text-3xl font-bold mb-4">Invoice</h2>

      <div className="mb-4">
        <p><b>Booking ID:</b> #{invoice.booking_id}</p>
        <p><b>Status:</b> {invoice.status}</p>
      </div>

      <hr className="my-4" />

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Customer</h3>
        <p>{invoice.user_name}</p>
        <p>{invoice.user_email}</p>
      </div>

      <hr className="my-4" />

      <div className="flex gap-4">
        <img
          src={`http://localhost:1000/${invoice.car_image}`}
          className="w-40 h-28 object-cover rounded"
        />

        <div>
          <h3 className="text-xl font-semibold">{invoice.car_name}</h3>
          <p>{invoice.pickup_location} → {invoice.drop_location}</p>
          <p>{invoice.start_date} → {invoice.end_date}</p>
        </div>
      </div>

      <hr className="my-4" />

      <div className="text-right">
        <p className="text-xl font-bold">
          Total Amount: ₹{invoice.total_amount}
        </p>
      </div>

      <button
        onClick={() => window.print()}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
      >
        Print / Download Invoice
      </button>
    </div>
  );
};

export default Invoice;
