import React, { useEffect, useState } from "react";
import carRegisterApi from "../../utils/carRegisterApi";

const API_BASE = "http://localhost:1000";

// If DB stores only filename, keep this.
// If DB stores "/uploads/cars/filename", it will still work.
const makeFileUrl = (p) => {
  if (!p) return "";
  p = String(p).replace(/\\/g, "/");

  if (p.startsWith("http://") || p.startsWith("https://")) return p;

  // if only filename -> uploads/cars
  if (!p.includes("/")) return `${API_BASE}/uploads/cars/${p}`;

  // remove public/ if stored
  if (p.startsWith("public/")) p = p.replace("public/", "");

  if (!p.startsWith("/")) p = "/" + p;

  return API_BASE + p;
};

const statusBadge = (s) => {
  if (s === "APPROVED") return "bg-green-100 text-green-700";
  if (s === "REJECTED") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
};

const CarRegisterCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ optional: show all statuses
  const [showAll, setShowAll] = useState(false);

  // ✅ edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    city: "",
    year: "",
    seats: "",
    fuel_type: "",
    price_per_day: "",
    price_per_km: "",
    car_details: "",
    category_id: "",
    requested_category_id: "",
  });

  const fetchMyCars = async () => {
    try {
      setLoading(true);

      const url = showAll ? "/cars/my/all" : "/cars/my";
      const res = await carRegisterApi.get(url);

      setCars(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load cars");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAll]);

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      const ok = window.confirm("Are you sure you want to delete this car?");
      if (!ok) return;

      await carRegisterApi.delete(`/cars/${id}`);
      alert("Deleted ✅");
      fetchMyCars();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  // ✅ OPEN EDIT MODAL
  const openEdit = (c) => {
    setEditId(c.id);
    setForm({
      name: c.name || "",
      brand: c.brand || "",
      city: c.city || "",
      year: c.year || "",
      seats: c.seats || "",
      fuel_type: c.fuel_type || "",
      price_per_day: c.price_per_day || "",
      price_per_km: c.price_per_km || "",
      car_details: c.car_details || "",
      category_id: c.category_id || "",
      requested_category_id: c.requested_category_id || c.category_id || "",
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditId(null);
    setSaving(false);
  };

  // ✅ SAVE EDIT
  const saveEdit = async () => {
    try {
      if (!editId) return;
      setSaving(true);

      await carRegisterApi.put(`/cars/${editId}`, {
        name: form.name,
        brand: form.brand,
        city: form.city,
        year: form.year,
        seats: form.seats,
        fuel_type: form.fuel_type,
        price_per_day: form.price_per_day,
        price_per_km: form.price_per_km,
        car_details: form.car_details,
        category_id: form.category_id,
        requested_category_id: form.requested_category_id,
      });

      alert("Updated ✅");
      closeEdit();
      fetchMyCars();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-black text-gray-900">My Cars</div>

        <button
          onClick={() => setShowAll((p) => !p)}
          className="px-4 py-2 rounded-xl border font-semibold text-sm hover:bg-gray-50"
        >
          {showAll ? "Show Approved Only" : "Show All Requests"}
        </button>
      </div>

      <div className="bg-white border border-gray-200/60 shadow-sm rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : cars.length === 0 ? (
          <div className="p-6 text-gray-600">
            {showAll
              ? "No car requests found."
              : "No approved cars found yet. (Switch to 'Show All Requests' to see pending/rejected.)"}
          </div>
        ) : (
          <div className="divide-y">
            {cars.map((c) => (
              <div key={c.id} className="p-5 flex gap-4">
                {/* Image */}
                <div className="w-32 h-20 rounded-xl overflow-hidden border bg-gray-50 flex-shrink-0">
                  {c.cars_image ? (
                    <img
                      src={makeFileUrl(c.cars_image)}
                      alt={c.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-black text-lg text-gray-900">
                        {c.name}{" "}
                        <span className="text-gray-500 font-semibold">({c.brand})</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {c.city || "-"} • {c.fuel_type || "-"} • Seats: {c.seats || "-"} • Year:{" "}
                        {c.year || "-"}
                      </div>
                      {c.car_details && (
                        <div className="text-sm text-gray-700 mt-1">{c.car_details}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge(c.status)}`}>
                        {c.status || "PENDING"}
                      </div>

                      {/* ✅ EDIT BUTTON */}
                      <button
                        onClick={() => openEdit(c)}
                        className="px-3 py-1 rounded-lg border text-xs font-bold hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      {/* ✅ DELETE BUTTON */}
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-sm font-semibold text-gray-900">
                    ₹{c.price_per_day || "-"} / day
                  </div>
                   <div className="mt-2 text-sm font-semibold text-gray-900">
                    ₹{c.price_per_km || "-"} / Km
                  </div>


                  {/* If showAll, show remark on reject */}
                  {showAll && c.status === "REJECTED" && (
                    <div className="mt-2 text-sm text-red-600">
                      Admin Remark: {c.admin_remark || "Rejected"}
                    </div>
                  )}
                </div>

                {/* Documents (optional, only if your API returns them in /my/all) */}
                {showAll && (
                  <div className="w-44 text-xs text-gray-700">
                    <div className="font-bold text-gray-900 mb-2">Docs</div>

                    <div className="flex flex-col gap-1">
                      {c.rc_book && (
                        <a className="block text-blue-600 hover:underline" href={makeFileUrl(c.rc_book)} target="_blank" rel="noreferrer">
                          RC Book
                        </a>
                      )}
                      {c.insurance_copy && (
                        <a className="block text-blue-600 hover:underline" href={makeFileUrl(c.insurance_copy)} target="_blank" rel="noreferrer">
                          Insurance
                        </a>
                      )}
                      {c.puc_certificate && (
                        <a className="block text-blue-600 hover:underline" href={makeFileUrl(c.puc_certificate)} target="_blank" rel="noreferrer">
                          PUC
                        </a>
                      )}
                      {c.id_proof && (
                        <a className="block text-blue-600 hover:underline" href={makeFileUrl(c.id_proof)} target="_blank" rel="noreferrer">
                          ID Proof
                        </a>
                      )}
                      {!c.rc_book && !c.insurance_copy && !c.puc_certificate && !c.id_proof && (
                        <div className="text-gray-400">No docs</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ EDIT MODAL (simple) */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b">
              <div className="text-xl font-black">Edit Car</div>
              <div className="text-sm text-gray-500">Update fields and save</div>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ["name", "Car Name"],
                ["brand", "Brand"],
                ["city", "City"],
                ["year", "Year"],
                ["seats", "Seats"],
                ["fuel_type", "Fuel Type"],
                ["price_per_day", "Price Per Day"],
                ["price_per_km", "Price Per KM"],
                ["category_id", "Category ID"],
                ["requested_category_id", "Requested Category ID"],
              ].map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <div className="text-xs font-bold text-gray-700">{label}</div>
                  <input
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  />
                </div>
              ))}

              <div className="space-y-1 md:col-span-2">
                <div className="text-xs font-bold text-gray-700">Car Details</div>
                <textarea
                  className="w-full border rounded-xl px-3 py-2 text-sm min-h-[90px]"
                  value={form.car_details}
                  onChange={(e) => setForm((p) => ({ ...p, car_details: e.target.value }))}
                />
              </div>
            </div>

            <div className="p-5 border-t flex items-center justify-end gap-2">
              <button onClick={closeEdit} className="px-4 py-2 rounded-xl border font-bold">
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-black text-white font-bold disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarRegisterCars;
