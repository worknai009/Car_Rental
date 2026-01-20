import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminApi from "../../utils/adminApi";

const fuelOptions = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    car_details: "",
    category_id: "",
    price_per_day: "",
    price_per_km: "",
    is_available: 1,

    city: "",
    year: "",
    seats: "",
    fuel_type: "",
    rating: "",
    badge: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "is_available" ? Number(value) : value,
    }));
  };

  const fetchCategories = async () => {
    const res = await adminApi.get("/admin/categories");
    const list = Array.isArray(res.data) ? res.data : [];
    setCategories(list.filter((c) => c.is_active === 1 || c.is_active === true));
  };

  const fetchCar = async () => {
    const res = await adminApi.get(`/admin/cars/${id}`);
    const c = res.data;

    setForm({
      name: c.name ?? "",
      brand: c.brand ?? "",
      car_details: c.car_details ?? "",
      category_id: c.category_id ?? "",
      price_per_day: c.price_per_day ?? "",
      price_per_km: c.price_per_km ?? "",
      is_available: Number(c.is_available ?? 1),

      city: c.city ?? "",
      year: c.year ?? "",
      seats: c.seats ?? "",
      fuel_type: c.fuel_type ?? "",
      rating: c.rating ?? "",
      badge: c.badge ?? "",
    });

    setPreview(c.cars_image ? `http://localhost:1000/public/${c.cars_image}` : "");
  };

  useEffect(() => {
    fetchCategories();
    fetchCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      if (image) fd.append("cars_image", image);

      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      await adminApi.put(`/admin/cars/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Car updated!");
      navigate("/admin/cars");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Edit Car</h2>
        <button
          onClick={() => navigate("/admin/cars")}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-bold"
        >
          Back
        </button>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border p-2 rounded" name="name" value={form.name} onChange={onChange} placeholder="Car name" required />
        <input className="border p-2 rounded" name="brand" value={form.brand} onChange={onChange} placeholder="Brand" required />

        <select className="border p-2 rounded" name="category_id" value={form.category_id} onChange={onChange} required>
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input className="border p-2 rounded" name="price_per_day" value={form.price_per_day} onChange={onChange} placeholder="Price per day" required />
        <input className="border p-2 rounded" name="price_per_km" value={form.price_per_km} onChange={onChange} placeholder="Price per km" required />


        <select className="border p-2 rounded" name="is_available" value={form.is_available} onChange={onChange}>
          <option value={1}>Available</option>
          <option value={0}>Not Available</option>
        </select>

        <input className="border p-2 rounded" name="city" value={form.city} onChange={onChange} placeholder="City" />
        <input className="border p-2 rounded" name="year" value={form.year} onChange={onChange} placeholder="Year (e.g. 2022)" />
        <input className="border p-2 rounded" name="seats" value={form.seats} onChange={onChange} placeholder="Seats (e.g. 5)" />

        <select className="border p-2 rounded" name="fuel_type" value={form.fuel_type} onChange={onChange}>
          <option value="">Fuel Type</option>
          {fuelOptions.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <input className="border p-2 rounded" name="rating" value={form.rating} onChange={onChange} placeholder="Rating (e.g. 4.6)" />
        <input className="border p-2 rounded" name="badge" value={form.badge} onChange={onChange} placeholder="Badge (e.g. Popular / Luxury)" />

        <div className="md:col-span-2">
          <textarea
            className="border p-2 rounded w-full"
            name="car_details"
            value={form.car_details}
            onChange={onChange}
            placeholder="Car details"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Car Image</label>
          <input
            type="file"
            className="border p-2 rounded w-full"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImage(file);
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />

          {preview ? (
            <img src={preview} alt="preview" className="mt-3 w-44 h-28 object-cover rounded" />
          ) : (
            <p className="text-gray-400 mt-2">No image</p>
          )}
        </div>

        <button
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-bold md:col-span-2 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Car"}
        </button>
      </form>
    </div>
  );
};

export default EditCar;
