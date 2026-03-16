import React, { useState, useEffect } from "react";
import carRegisterApi from "../../utils/carRegisterApi";

/* ================= COMMON INPUT STYLE ================= */
const INPUT =
  "mt-1 w-full rounded-xl border border-gray-400 px-4 py-3 bg-white " +
  "focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition";

/* ================= LUXURY CATEGORY STYLES ================= */
const CATEGORY_STYLES = {
  SILVER: {
    card: "border-gray-400 bg-gray-50",
    active: "border-gray-800 bg-gray-100",
    badge: "bg-gray-800 text-white",
  },
  GOLD: {
    card: "border-yellow-400 bg-yellow-50",
    active: "border-yellow-600 bg-yellow-100",
    badge: "bg-yellow-600 text-white",
  },
  PLATINUM: {
    card: "border-purple-400 bg-purple-50",
    active: "border-purple-700 bg-purple-100",
    badge: "bg-purple-700 text-white",
  },
};

const LuxuryCard = ({ label, value, selected, onChange }) => {
  const styles = CATEGORY_STYLES[label];

  return (
    <label
      className={`cursor-pointer rounded-2xl border-2 p-5 transition-all
      ${selected ? styles.active : styles.card}`}
    >
      <input
        type="radio"
        name="requested_category_id"
        value={value}
        checked={selected}
        onChange={onChange}
        required
        className="hidden"
      />

      <div className="flex justify-between items-center">
        <div>
          <p className="font-black">{label}</p>
          <p className="text-xs text-gray-600">
            {label === "SILVER" && "Standard Luxury"}
            {label === "GOLD" && "Premium Luxury"}
            {label === "PLATINUM" && "Ultra Luxury"}
          </p>
        </div>

        {selected && (
          <span className={`px-3 py-1 text-xs rounded-full ${styles.badge}`}>
            Selected
          </span>
        )}
      </div>
    </label>
  );
};

const INITIAL_FORM = {
  name: "",
  brand: "",
  category_id: "",
  car_details: "",
  city: "",
  year: "",
  seats: "",
  fuel_type: "",
  price_per_day: "",
  price_per_km: "",
  requested_category_id: "",
  vehicle_type: "Car",
};

const INITIAL_FILES = {
  cars_image: null,
  rc_book: null,
  insurance_copy: null,
  puc_certificate: null,
  id_proof: null,
};

const CarRegisterAddCar = () => {
  const [carCategories, setCarCategories] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState(INITIAL_FILES);

  // used to force-remount file inputs after successful submit
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    carRegisterApi.get("/categories").then((res) => {
      setCarCategories(res.data || []);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFile = (e) => {
    const { name, files: fileList } = e.target;
    setFiles((p) => ({ ...p, [name]: fileList?.[0] || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (v !== "") data.append(k, v);
      });

      Object.entries(files).forEach(([k, v]) => {
        if (v) data.append(k, v);
      });

      await carRegisterApi.post("/cars/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Car submitted for approval ✅");

      // ✅ Reset everything
      setForm(INITIAL_FORM);
      setFiles(INITIAL_FILES);
      setResetKey((k) => k + 1); // clears file inputs
    } catch (err) {
      console.error(err);
      alert("Submission failed ❌");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-black">Register Your Car</h1>

      {/* key={resetKey} forces remount of form -> clears file inputs */}
      <form key={resetKey} onSubmit={handleSubmit} className="bg-white p-8 space-y-10">
        {/* CAR INFO */}
        <section>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Car Name"
              className={INPUT}
              required
            />
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand"
              className={INPUT}
              required
            />

              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className={INPUT}
                required
              >
                <option value="">Select Category</option>
                {carCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                name="vehicle_type"
                value={form.vehicle_type}
                onChange={handleChange}
                className={INPUT}
                required
              >
                <option value="Car">Car</option>
                <option value="Bus">Bus</option>
              </select>
          </div>

          <textarea
            name="car_details"
            value={form.car_details}
            onChange={handleChange}
            className={INPUT}
            rows={3}
            placeholder="Car Details"
          />
        </section>

        {/* SPECS */}
        <section>
          <div className="grid md:grid-cols-4 gap-4">
            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="Year"
              className={INPUT}
              type="number"
            />
            <input
              name="seats"
              value={form.seats}
              onChange={handleChange}
              placeholder="Seats"
              className={INPUT}
              type="number"
            />

            <select name="fuel_type" value={form.fuel_type} onChange={handleChange} className={INPUT}>
              <option value="">Fuel Type</option>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>CNG</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className={INPUT}
            />
          </div>

          <input
            name="price_per_day"
            value={form.price_per_day}
            onChange={handleChange}
            placeholder="Price Per Day"
            className={INPUT}
            type="number"
          />

          <input
            name="price_per_km"
            value={form.price_per_km}
            onChange={handleChange}
            placeholder="Price Per KM"
            className={INPUT}
            type="number"
          />
        </section>

        {/* LUXURY */}
        <section className="grid md:grid-cols-3 gap-4">
          <LuxuryCard
            label="SILVER"
            value="1"
            selected={form.requested_category_id === "1"}
            onChange={handleChange}
          />
          <LuxuryCard
            label="GOLD"
            value="2"
            selected={form.requested_category_id === "2"}
            onChange={handleChange}
          />
          <LuxuryCard
            label="PLATINUM"
            value="3"
            selected={form.requested_category_id === "3"}
            onChange={handleChange}
          />
        </section>

        {/* FILES */}
        <section>
          <h2 className="font-black mb-4 text-lg">Upload Documents</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: "cars_image", label: "Car Image (Front / Side)", accept: "image/*" },
              { key: "rc_book", label: "RC Book", accept: "image/*,application/pdf" },
              { key: "insurance_copy", label: "Insurance Copy", accept: "image/*,application/pdf" },
              { key: "puc_certificate", label: "PUC Certificate", accept: "image/*,application/pdf" },
              { key: "id_proof", label: "Owner ID Proof (Aadhar / DL)", accept: "image/*,application/pdf" },
            ].map(({ key, label, accept }) => (
              <div key={key} className="border rounded-xl p-4">
                <label className="block text-sm font-bold mb-2">{label}</label>

                <input
                  type="file"
                  name={key}
                  accept={accept}
                  onChange={handleFile}
                  required
                  className="block w-full text-sm"
                />

                {files[key] && (
                  <p className="mt-2 text-xs text-green-600">Selected: {files[key].name}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="bg-black text-white px-10 py-4 rounded-xl">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CarRegisterAddCar;
