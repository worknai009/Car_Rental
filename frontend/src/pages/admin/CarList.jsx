import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../utils/adminApi";

const CarList = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizeCars = (list) =>
    (Array.isArray(list) ? list : []).map((c) => ({
      ...c,
      // ✅ IMPORTANT: convert to number (0/1)
      is_available: Number(c.is_available ?? 0),
      is_active: Number(c.is_active ?? 1),
    }));

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/admin/cars");
      setCars(normalizeCars(res.data));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load cars");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Delete this car?")) return;
    try {
      await adminApi.delete(`/admin/cars/${id}`);
      setCars((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const toggleAvailability = async (car) => {
    try {
      const current = Number(car.is_available) === 1; // ✅ true/false
      const next = current ? 0 : 1;

      await adminApi.put(`/admin/cars/${car.id}/availability`, {
        is_available: next,
      });

      // ✅ Update UI state (numbers only)
      setCars((prev) =>
        prev.map((c) => (c.id === car.id ? { ...c, is_available: next } : c))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update availability");
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  if (loading) return <div>Loading cars...</div>;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">Cars List</h2>

        <button
          onClick={() => navigate("/admin/cars/add")}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-bold"
        >
          + Add Car
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Image</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Brand</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Price/Day</th>
              <th className="text-left p-3">Available</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {cars.map((c) => {
              const isAvailable = Number(c.is_available) === 1;

              return (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.id}</td>

                  <td className="p-3">
                    {c.cars_image ? (
                      <img
                        src={`http://localhost:1000/public/${c.cars_image}`}
                        alt="car"
                        className="w-16 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>

                  <td className="p-3 font-semibold">{c.name}</td>
                  <td className="p-3">{c.brand}</td>
                  <td className="p-3">{c.category_name || "-"}</td>
                  <td className="p-3">₹{c.price_per_day}</td>

                  <td className="p-3">
                    <button
                      onClick={() => toggleAvailability(c)}
                      className={`px-3 py-1 rounded text-white ${
                        isAvailable
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-600 hover:bg-gray-700"
                      }`}
                    >
                      {isAvailable ? "Yes" : "No"}
                    </button>
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/cars/edit/${c.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCar(c.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {cars.length === 0 && (
              <tr>
                <td colSpan={8} className="p-3 text-gray-500">
                  No cars found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarList;
