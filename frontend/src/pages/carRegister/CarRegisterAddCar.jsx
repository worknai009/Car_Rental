import React, { useState } from "react";

const CarRegisterAddCar = () => {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    details: "",
    category: "",
    fuel_type: "",
    year: "",
    seats: "",
    city: "",
    price_per_day: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Car submitted for admin approval");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Add Car</h1>
        <p className="text-sm text-gray-500">
          Fill car details. Admin approval required before listing.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-gray-200/60 shadow-sm p-6 space-y-6"
      >
        {/* Car Name & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-700">Car Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Swift Dzire"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              required
              value={form.brand}
              onChange={handleChange}
              placeholder="Maruti, Hyundai, Tata"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Car Details */}
        <div>
          <label className="text-sm font-bold text-gray-700">
            Car Details / Description
          </label>
          <textarea
            name="details"
            rows={3}
            value={form.details}
            onChange={handleChange}
            placeholder="Short description about the car"
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          />
        </div>

        {/* Category & Fuel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-700">Category</label>
            <select
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 bg-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            >
              <option value="">Select Category</option>
              <option>SUV</option>
              <option>Sedan</option>
              <option>Hatchback</option>
              <option>Luxury</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">Fuel Type</label>
            <select
              name="fuel_type"
              required
              value={form.fuel_type}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 bg-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            >
              <option value="">Select Fuel</option>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>CNG</option>
              <option>Electric</option>
            </select>
          </div>
        </div>

        {/* Year, Seats, City */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-700">Year</label>
            <input
              type="number"
              name="year"
              required
              value={form.year}
              onChange={handleChange}
              placeholder="2022"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">Seats</label>
            <input
              type="number"
              name="seats"
              required
              value={form.seats}
              onChange={handleChange}
              placeholder="5"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">City</label>
            <input
              type="text"
              name="city"
              required
              value={form.city}
              onChange={handleChange}
              placeholder="Pune"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-bold text-gray-700">
            Price Per Day (₹)
          </label>
          <input
            type="number"
            name="price_per_day"
            required
            value={form.price_per_day}
            onChange={handleChange}
            placeholder="1500"
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-black shadow-lg hover:shadow-xl transition"
          >
            Submit for Approval
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarRegisterAddCar;
