import React, { useEffect, useState } from "react";
import adminApi from "../../utils/adminApi";
import { Trash2, Mail, User, MessageSquare, Calendar,Phone } from "lucide-react";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      // Standardized API call
      const res = await adminApi.get("/admin/contacts");

      const list = Array.isArray(res.data) ? res.data : [];
      setContacts(list);
    } catch (err) {
      console.error("Fetch contacts error:", err);
      setContacts([]);

      // show readable error
      const msg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err.message ||
        "Failed to load contacts";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await adminApi.delete(`/admin/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Contact Messages</h1>

        <button
          onClick={fetchContacts}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold"
        >
          Refresh
        </button>
      </div>

      {/* ✅ Error box */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          <b>Error:</b> {error}
          <div className="text-sm mt-2">
            Most common reason: admin token missing/expired or route not mounted.
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl p-6 shadow">Loading...</div>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 shadow text-gray-600">
          No contact messages found.
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl shadow border p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-lg font-bold text-gray-900">
                    #{c.id} • {c.subject}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" /> {c.name}
                    </span>
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {c.email}
                    </span>

                    {c.phone && (
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {c.phone}
                      </span>
                    )}

                    {c.created_at && (
                      <span className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(c.created_at).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-2 text-gray-800 mt-2">
                    <MessageSquare className="w-4 h-4 mt-1 text-gray-500" />
                    <p className="text-sm leading-relaxed">{c.message}</p>
                  </div>
                </div>

                <button
                  onClick={() => deleteContact(c.id)}
                  className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-bold flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
