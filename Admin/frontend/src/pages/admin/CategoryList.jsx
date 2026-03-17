import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../utils/adminApi";

const CategoryList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/admin/categories");
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (cat) => {
    try {
      await adminApi.put(`/admin/categories/${cat.id}`, {
        name: cat.name,
        is_active: cat.is_active ? 0 : 1,
      });
      setRows((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, is_active: c.is_active ? 0 : 1 } : c))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await adminApi.delete(`/admin/categories/${id}`);
      setRows((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Category List</h2>
        <button
          onClick={() => navigate("/admin/categories/add")}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-bold"
        >
          + Add Category
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Active</th>
            <th className="text-left p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3">{c.id}</td>
              <td className="p-3">{c.name}</td>
              <td className="p-3">
                <button
                  onClick={() => toggleActive(c)}
                  className={`px-3 py-1 rounded text-white ${
                    c.is_active ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {c.is_active ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="p-3">
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr><td colSpan={4} className="p-3 text-gray-500">No categories found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
