import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../utils/adminApi";

const AddCar = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    car_details: "",
    category_id: "",
    price_per_day: "",
    price_per_km: "",
    is_available: 1,

    // ✅ NEW FIELDS
    city: "",
    year: "",
    seats: "",
    fuel_type: "Petrol",
    rating: "",
    badge: "",
    vehicle_type: "Car",
  });

  const fetchCategories = async () => {
    const res = await adminApi.get("/admin/categories");
    setCategories(
      Array.isArray(res.data)
        ? res.data.filter((c) => c.is_active === 1 || c.is_active === true)
        : []
    );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    // numeric fields
    if (["is_available", "year", "seats", "price_per_day"].includes(name)) {
      setForm((p) => ({ ...p, [name]: value })); // keep as string, convert in backend
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!image) {
        alert("Car image is required");
        setLoading(false);
        return;
      }

      // ✅ small validation for rating (optional)
      if (form.rating !== "" && (Number(form.rating) < 0 || Number(form.rating) > 5)) {
        alert("Rating must be between 0 and 5");
        setLoading(false);
        return;
      }

      const fd = new FormData();
      fd.append("cars_image", image);

      Object.entries(form).forEach(([k, v]) => {
        // send empty strings as empty (backend converts to null/0)
        fd.append(k, v);
      });

      await adminApi.post("/admin/cars", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/admin/cars");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Add Car</h2>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic */}
        <input
          className="border p-2 rounded"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Car name"
          required
        />

        <input
          className="border p-2 rounded"
          name="brand"
          value={form.brand}
          onChange={onChange}
          placeholder="Brand"
          required
        />

        <select
          className="border p-2 rounded"
          name="category_id"
          value={form.category_id}
          onChange={onChange}
          required
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          className="border p-2 rounded"
          name="price_per_day"
          value={form.price_per_day}
          onChange={onChange}
          placeholder="Price per day"
          required
        />

        <input
          className="border p-2 rounded"
          name="price_per_km"
          value={form.price_per_km}
          onChange={onChange}
          placeholder="Price per KM"
          required
        />

        <select
          className="border p-2 rounded"
          name="is_available"
          value={form.is_available}
          onChange={onChange}
        >
          <option value={1}>Available</option>
          <option value={0}>Not Available</option>
        </select>

        {/* ✅ NEW: City */}
        <input
          className="border p-2 rounded"
          name="city"
          value={form.city}
          onChange={onChange}
          placeholder="City (e.g., Pune, Mumbai)"
        />

        {/* ✅ NEW: Year */}
        <input
          type="number"
          className="border p-2 rounded"
          name="year"
          value={form.year}
          onChange={onChange}
          placeholder="Model Year (e.g., 2023)"
          min="1990"
          max="2050"
        />

        {/* ✅ NEW: Seats */}
        <input
          type="number"
          className="border p-2 rounded"
          name="seats"
          value={form.seats}
          onChange={onChange}
          placeholder="Seats (e.g., 5)"
          min="1"
          max="20"
        />

        {/* ✅ NEW: Fuel Type */}
        <select
          className="border p-2 rounded"
          name="fuel_type"
          value={form.fuel_type}
          onChange={onChange}
        >
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="CNG">CNG</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        {/* ✅ NEW: Rating */}
        <input
          type="number"
          step="0.1"
          className="border p-2 rounded"
          name="rating"
          value={form.rating}
          onChange={onChange}
          placeholder="Rating (0 - 5) e.g., 4.8"
          min="0"
          max="5"
        />

        {/* ✅ NEW: Badge */}
        <select
          className="border p-2 rounded"
          name="badge"
          value={form.badge}
          onChange={onChange}
        >
          <option value="">No Badge</option>
          <option value="PLATINUM">Platinum</option>
          <option value="GOLD">Gold</option>
          <option value="SILVER">Silver</option>
        </select>

        {/* ✅ Vehicle Type: Car / Bus */}
        <select
          className="border p-2 rounded"
          name="vehicle_type"
          value={form.vehicle_type}
          onChange={onChange}
          required
        >
          <option value="Car">Car</option>
          <option value="Bus">Bus</option>
        </select>

        {/* Image */}
        <input
          type="file"
          className="border p-2 rounded md:col-span-2"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          required
        />

        {/* Details */}
        <textarea
          className="border p-2 rounded md:col-span-2"
          name="car_details"
          value={form.car_details}
          onChange={onChange}
          placeholder="Car details"
          rows={4}
        />

        <button
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-bold md:col-span-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Car"}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
