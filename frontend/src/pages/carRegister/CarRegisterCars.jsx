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

  const fetchMyCars = async () => {
    try {
      setLoading(true);

      const url = showAll ? "/cars/my/all" : "/cars/my";
      // If your router is mounted like /car-register, then your carRegisterApi baseURL
      // probably already includes /car-register. If not, use "/car-register" prefix.
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
                        {c.name} <span className="text-gray-500 font-semibold">({c.brand})</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {c.city || "-"} • {c.fuel_type || "-"} • Seats: {c.seats || "-"} • Year: {c.year || "-"}
                      </div>
                      {c.car_details && (
                        <div className="text-sm text-gray-700 mt-1">
                          {c.car_details}
                        </div>
                      )}
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge(c.status)}`}>
                      {c.status || "PENDING"}
                    </div>
                  </div>

                  <div className="mt-2 text-sm font-semibold text-gray-900">
                    ₹{c.price_per_day || "-"} / day
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
                        <a
                          className="block text-blue-600 hover:underline"
                          href={makeFileUrl(c.rc_book)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          RC Book
                        </a>
                      )}

                      {c.insurance_copy && (
                        <a
                          className="block text-blue-600 hover:underline"
                          href={makeFileUrl(c.insurance_copy)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Insurance
                        </a>
                      )}

                      {c.puc_certificate && (
                        <a
                          className="block text-blue-600 hover:underline"
                          href={makeFileUrl(c.puc_certificate)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          PUC
                        </a>
                      )}

                      {c.id_proof && (
                        <a
                          className="block text-blue-600 hover:underline"
                          href={makeFileUrl(c.id_proof)}
                          target="_blank"
                          rel="noreferrer"
                        >
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
    </div>
  );
};

export default CarRegisterCars;
