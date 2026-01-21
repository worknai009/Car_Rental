import React, { useMemo, useState } from "react";
import { useCarRegisterAuth } from "../../components/carRegister/CarRegisterAuthContext";

const safe = (v) => (v === null || v === undefined || v === "" ? "-" : String(v));

// ✅ Strong date formatter (works for "2026-01-19 14:20:37" and "2026-01-19")
const formatDate = (value) => {
  if (!value) return "-";

  // if value already like "YYYY-MM-DD"
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // convert "YYYY-MM-DD HH:mm:ss" => "YYYY-MM-DDTHH:mm:ss"
  const normalized = s.includes(" ") ? s.replace(" ", "T") : s;

  const d = new Date(normalized);
  if (isNaN(d.getTime())) {
    // fallback: try to cut first 10 characters
    return s.length >= 10 ? s.slice(0, 10) : s;
  }

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getInitials = (name) => {
  const n = (name || "").trim();
  if (!n) return "U";
  const parts = n.split(" ").filter(Boolean);
  const a = parts[0]?.[0] || "U";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase();
};

const InfoItem = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-200/70 bg-white p-4">
    <div className="text-xs font-bold text-gray-500">{label}</div>
    <div className="mt-1 text-sm font-semibold text-gray-900">{safe(value)}</div>
  </div>
);

const StatusPill = ({ status }) => {
  const s = String(status || "").toUpperCase();
  const cls =
    s === "ACTIVE"
      ? "bg-green-100 text-green-700"
      : s === "INACTIVE"
      ? "bg-gray-100 text-gray-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cls}`}>
      {s || "-"}
    </span>
  );
};

const CarRegisterProfile = () => {
  const { user } = useCarRegisterAuth();
  const [showRaw, setShowRaw] = useState(false);

  // ✅ map exactly your schema fields
  const profile = useMemo(() => {
    const u = user || {};
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      status: u.status,
      joined: u.created_at || u.createdAt, // ✅ important
      updated: u.updated_at || u.updatedAt,
    };
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-2xl font-black text-gray-900">Profile</div>
          <div className="text-sm text-gray-500">
            View your account information.
          </div>
        </div>

        <button
          onClick={() => setShowRaw((p) => !p)}
          className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50"
        >
          {showRaw ? "Hide Raw Data" : "View Raw Data"}
        </button>
      </div>

      {/* Profile Card */}
      <div className="rounded-3xl border border-gray-200/60 bg-white shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-xl font-black">
            {getInitials(profile.name)}
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-lg font-black text-gray-900 truncate">
                {safe(profile.name)}
              </div>
              <StatusPill status={profile.status} />
            </div>

            <div className="mt-1 text-sm text-gray-600">{safe(profile.email)}</div>

            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
              <span className="px-3 py-1 rounded-full bg-gray-100">
                ID: {safe(profile.id)}
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100">
                Role: {safe(profile.role)}
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100">
                Joined: {formatDate(profile.joined)}
              </span>
            </div>
          </div>

          {/* Actions (UI only) */}
          {/* <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-90">
              Edit Profile
            </button>
            <button className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50">
              Change Password
            </button>
          </div> */}
        </div>

        {/* Info Grid */}
        <div className="p-6 pt-0 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoItem label="Email" value={profile.email} />
          <InfoItem label="Phone" value={profile.phone} />
          <InfoItem label="Joined" value={formatDate(profile.joined)} />
          <InfoItem label="Updated" value={formatDate(profile.updated)} />
        </div>
      </div>

      {/* Raw JSON */}
      {showRaw && (
        <pre className="p-6 rounded-3xl bg-white border border-gray-200/60 shadow-sm overflow-auto text-xs text-gray-800">
{JSON.stringify(user || {}, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default CarRegisterProfile;
