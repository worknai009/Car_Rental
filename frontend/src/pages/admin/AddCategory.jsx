import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../utils/adminApi";

const AddCategory = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", is_active: 1 });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.name === "is_active" ? Number(e.target.value) : e.target.value,
    }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApi.post("/admin/categories", form);
      navigate("/admin/categories");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Add Category</h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Category Name</label>
          <input
            className="w-full border p-2 rounded-lg mt-1"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="SUV, Sedan..."
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Active</label>
          <select
            className="w-full border p-2 rounded-lg mt-1"
            name="is_active"
            value={form.is_active}
            onChange={onChange}
          >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </div>

        <button
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
