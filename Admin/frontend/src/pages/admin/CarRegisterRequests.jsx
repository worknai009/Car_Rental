import React, { useEffect, useMemo, useState } from "react";
import adminApi from "../../utils/adminApi";

const API_BASE = import.meta.env.VITE_API_URL;

const makeFileUrl = (p) => {
  if (!p) return "";
  p = String(p).replace(/\\/g, "/");

  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  if (p.startsWith("public/")) p = p.replace("public/", "");

  // filename-only → stored in /uploads/cars/
  if (!p.includes("/")) return `${API_BASE}/uploads/cars/${p}`;

  if (!p.startsWith("/")) p = "/" + p;
  return API_BASE + p;
};

const getFileType = (url) => {
  const u = (url || "").toLowerCase();
  if (u.endsWith(".pdf")) return "pdf";
  if (u.endsWith(".png") || u.endsWith(".jpg") || u.endsWith(".jpeg") || u.endsWith(".webp"))
    return "image";
  return "other";
};

const PreviewModal = ({ open, url, title, onClose }) => {
  const type = useMemo(() => getFileType(url), [url]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <div className="font-bold text-sm text-gray-800 truncate">
            {title || "Preview"}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold px-3 py-1 rounded-lg border hover:bg-gray-50"
            >
              Open
            </a>
            <button
              onClick={onClose}
              className="text-xs font-semibold px-3 py-1 rounded-lg bg-black text-white"
            >
              Close
            </button>
          </div>
        </div>

        <div className="h-[75vh] bg-gray-50">
          {type === "image" ? (
            <img
              src={url}
              alt="preview"
              className="w-full h-full object-contain"
            />
          ) : type === "pdf" ? (
            <iframe
              title="pdf-preview"
              src={url}
              className="w-full h-full"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600">
              Preview not supported. Use “Open”.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FileLink = ({ label, path, onPreview }) => {
  if (!path) return <span className="text-xs text-gray-400">{label}: N/A</span>;
  const url = makeFileUrl(path);

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        className="text-xs font-semibold text-blue-600 hover:underline"
        onMouseEnter={() => onPreview({ url, title: label })}
        onFocus={() => onPreview({ url, title: label })}
      >
        {label}
      </button>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-[11px] text-gray-500 hover:text-gray-800"
        title="Open in new tab"
      >
        ↗
      </a>
    </span>
  );
};

const CarRegisterRequests = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRow, setOpenRow] = useState(null);

  // ✅ modal state
  const [preview, setPreview] = useState({ open: false, url: "", title: "" });
  const openPreview = ({ url, title }) =>
    setPreview({ open: true, url, title });
  const closePreview = () => setPreview({ open: false, url: "", title: "" });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/car-requests");
      setCars(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load car requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveCar = async (id) => {
    if (!window.confirm("Approve this car and publish it?")) return;
    try {
      await adminApi.post(`/admin/car-requests/${id}/approve`);
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Approve failed");
    }
  };

  const rejectCar = async (id) => {
    const reason = prompt("Enter reject reason");
    if (!reason) return;

    try {
      await adminApi.post(`/admin/car-requests/${id}/reject`, { reason });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Reject failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* ✅ modal */}
      <PreviewModal
        open={preview.open}
        url={preview.url}
        title={preview.title}
        onClose={closePreview}
      />

      <div>
        <h1 className="text-2xl font-black text-gray-900">
          Car Register Requests
        </h1>
        <p className="text-sm text-gray-500">
          Review and approve cars submitted by users
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-600">Loading...</div>
        ) : cars.length === 0 ? (
          <div className="p-6 text-gray-600">
            No car registration requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Car Register User</th>
                  <th className="px-4 py-3 text-left">Car</th>
                  <th className="px-4 py-3 text-left">Brand</th>
                  <th className="px-4 py-3 text-left">City</th>
                  <th className="px-4 py-3 text-left">Fuel</th>
                  <th className="px-4 py-3 text-left">Seats</th>
                  <th className="px-4 py-3 text-left">Price / Day</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Car Image</th>
                  <th className="px-4 py-3 text-left">Documents</th>
                  <th className="px-4 py-3 text-left">More</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {cars.map((c) => {
                  const imgUrl = makeFileUrl(c.cars_image);
                  const isOpen = openRow === c.id;

                  return (
                    <React.Fragment key={c.id}>
                      <tr className="border-t align-top">
                        <td className="px-4 py-3">{c.car_register_user}</td>
                        <td className="px-4 py-3 font-semibold">{c.car_name}</td>
                        <td className="px-4 py-3">{c.brand}</td>
                        <td className="px-4 py-3">{c.city}</td>
                        <td className="px-4 py-3">{c.fuel_type}</td>
                        <td className="px-4 py-3">{c.seats}</td>
                        <td className="px-4 py-3">₹{c.price_per_day}</td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : c.status === "APPROVED"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                              }`}
                          >
                            {c.status}
                          </span>
                        </td>

                        {/* ✅ hover preview for car image too */}
                        <td className="px-4 py-3">
                          {c.cars_image ? (
                            <button
                              type="button"
                              className="text-xs font-semibold text-blue-600 hover:underline"
                              onMouseEnter={() =>
                                openPreview({ url: imgUrl, title: "Car Image" })
                              }
                            >
                              Preview
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <FileLink label="RC Book" path={c.rc_book} onPreview={openPreview} />
                            <FileLink label="Insurance" path={c.insurance_copy} onPreview={openPreview} />
                            <FileLink label="PUC" path={c.puc_certificate} onPreview={openPreview} />
                            <FileLink label="ID Proof" path={c.id_proof} onPreview={openPreview} />
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <button
                            className="text-xs font-semibold text-black underline"
                            onClick={() => setOpenRow(isOpen ? null : c.id)}
                          >
                            {isOpen ? "Hide" : "View Details"}
                          </button>
                        </td>

                        <td className="px-4 py-3 space-x-2">
                          <button
                            onClick={() => approveCar(c.id)}
                            disabled={c.status !== "PENDING"}
                            className="px-4 py-1.5 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectCar(c.id)}
                            disabled={c.status !== "PENDING"}
                            className="px-4 py-1.5 rounded-lg bg-red-600 text-white font-semibold disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>

                      {isOpen && (
                        <tr className="border-t bg-gray-50">
                          <td colSpan={11} className="px-4 py-4">
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-xs text-gray-500">Car Details</div>
                                <div className="font-semibold">{c.car_details || "-"}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Year</div>
                                <div className="font-semibold">{c.year || "-"}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Category IDs</div>
                                <div className="font-semibold">
                                  category_id: {c.category_id || "-"} <br />
                                  requested_category_id: {c.requested_category_id || "-"} <br />
                                  approved_category_id: {c.approved_category_id || "-"}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Admin Remark</div>
                                <div className="font-semibold">{c.admin_remark || "-"}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Created At</div>
                                <div className="font-semibold">{c.created_at || "-"}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Updated At</div>
                                <div className="font-semibold">{c.updated_at || "-"}</div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarRegisterRequests;
