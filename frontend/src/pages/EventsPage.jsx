import React, { useEffect, useMemo, useState } from "react";
import userApi from "../utils/userApi";
import {
  CalendarDays,
  MapPin,
  Users,
  Search,
  X,
  Ticket,
  ArrowRight,
} from "lucide-react";

const API_BASE = "http://localhost:1000";

// fallback demo data (if API not ready)
const DEMO_EVENTS = [
  {
    id: 1,
    title: "Luxury Car Expo 2026",
    city: "Pune",
    venue: "Phoenix Mall",
    start_datetime: "2026-02-01T10:00:00",
    end_datetime: "2026-02-01T18:00:00",
    price: 299,
    capacity: 200,
    booked_count: 46,
    image: "/uploads/events/demo-event-1.jpg",
    description: "Showcase of premium and luxury cars with live demos.",
  },
  {
    id: 2,
    title: "Road Trip Meetup",
    city: "Mumbai",
    venue: "BKC Grounds",
    start_datetime: "2026-02-05T16:00:00",
    end_datetime: "2026-02-05T20:00:00",
    price: 0,
    capacity: 150,
    booked_count: 20,
    image: "/uploads/events/demo-event-2.jpg",
    description: "Meet fellow riders, network, and plan trips together.",
  },
];

const safe = (v) => (v === null || v === undefined || v === "" ? "-" : String(v));

const makeFileUrl = (p) => {
  if (!p) return "";
  let x = String(p).replace(/\\/g, "/");
  if (x.startsWith("http://") || x.startsWith("https://")) return x;
  if (!x.startsWith("/")) x = "/" + x;
  return API_BASE + x; // expects static mapped like /uploads/...
};

const formatDateTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return safe(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
};

const Modal = ({ open, title, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onMouseDown={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="font-black text-gray-900">{title}</div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100" type="button">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [city, setCity] = useState("all");
  const [date, setDate] = useState(""); // yyyy-mm-dd
  const [maxPrice, setMaxPrice] = useState("");

  // booking modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);

      // ✅ if backend ready, use this:
      // const res = await userApi.get("/events");
      // const list = Array.isArray(res.data) ? res.data : [];
      // setEvents(list);

      // ✅ demo fallback:
      setEvents(DEMO_EVENTS);
    } catch (e) {
      console.error(e);
      setEvents(DEMO_EVENTS);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      setLoadingBookings(true);

      // ✅ if backend ready:
      // const res = await userApi.get("/events/my-bookings");
      // setMyBookings(Array.isArray(res.data) ? res.data : []);

      // ✅ demo fallback:
      setMyBookings([]);
    } catch (e) {
      console.error(e);
      setMyBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchMyBookings();
  }, []);

  const cities = useMemo(() => {
    const s = new Set(events.map((e) => e.city).filter(Boolean));
    return Array.from(s);
  }, [events]);

  const filtered = useMemo(() => {
    let list = [...events];

    if (q.trim()) {
      const x = q.trim().toLowerCase();
      list = list.filter(
        (e) =>
          (e.title || "").toLowerCase().includes(x) ||
          (e.venue || "").toLowerCase().includes(x)
      );
    }

    if (city !== "all") list = list.filter((e) => e.city === city);

    if (date) {
      list = list.filter((e) => {
        const d = new Date(e.start_datetime);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}` === date;
      });
    }

    if (maxPrice !== "") {
      const mp = Number(maxPrice);
      if (!Number.isNaN(mp)) list = list.filter((e) => Number(e.price || 0) <= mp);
    }

    // newest first by id
    list.sort((a, b) => Number(b.id) - Number(a.id));
    return list;
  }, [events, q, city, date, maxPrice]);

  const seatsLeft = (e) => {
    const cap = Number(e.capacity || 0);
    const booked = Number(e.booked_count || 0);
    const left = Math.max(0, cap - booked);
    return left;
  };

  const openBooking = (e) => {
    setSelected(e);
    setQty(1);
    setNote("");
    setOpen(true);
  };

  const total = useMemo(() => {
    const p = Number(selected?.price || 0);
    return p * Number(qty || 1);
  }, [selected, qty]);

  const submitBooking = async () => {
    if (!selected) return;

    const left = seatsLeft(selected);
    if (left <= 0) {
      alert("Sold out ❌");
      return;
    }
    if (qty < 1) {
      alert("Quantity must be at least 1");
      return;
    }
    if (qty > left) {
      alert(`Only ${left} seats left`);
      return;
    }

    try {
      setSubmitting(true);

      // ✅ backend call when ready:
      // await userApi.post(`/events/${selected.id}/book`, { qty, note });

      alert("Booking successful ✅ (demo)");
      setOpen(false);
      fetchMyBookings();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const clearFilters = () => {
    setQ("");
    setCity("all");
    setDate("");
    setMaxPrice("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 pb-16">
      <Modal
        open={open}
        title={selected ? `Book: ${selected.title}` : "Book Event"}
        onClose={() => setOpen(false)}
      >
        {!selected ? null : (
          <div className="space-y-5">
            <div className="rounded-2xl border bg-gray-50 p-4">
              <div className="font-black text-gray-900">{selected.title}</div>
              <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-cyan-600" />
                  {safe(selected.city)} • {safe(selected.venue)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-cyan-600" />
                  {formatDateTime(selected.start_datetime)} → {formatDateTime(selected.end_datetime)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="w-4 h-4 text-cyan-600" />
                  Seats left: {seatsLeft(selected)}
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1">Tickets</div>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full border rounded-2xl px-4 py-3 bg-white"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1">Price</div>
                <div className="w-full border rounded-2xl px-4 py-3 bg-white font-black text-gray-900">
                  ₹{Number(selected.price || 0)} / ticket
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-500 mb-1">Note (optional)</div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border rounded-2xl px-4 py-3 bg-white min-h-[90px]"
                placeholder="Any special note..."
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-black text-gray-900">₹{total}</div>
            </div>

            <button
              onClick={submitBooking}
              disabled={submitting}
              className="w-full bg-black text-white rounded-2xl py-3 font-bold disabled:opacity-60"
              type="button"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        )}
      </Modal>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-4xl font-black text-gray-900">Events</div>
            <div className="text-gray-600 mt-1">
              Book events like expos, meetups, and trips.
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl border bg-white text-sm font-semibold hover:bg-gray-50"
            type="button"
          >
            Clear Filters
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl border border-gray-200/60 shadow-sm p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search title / venue..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border bg-gray-50 focus:bg-white outline-none"
              />
            </div>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border bg-gray-50 focus:bg-white outline-none"
            >
              <option value="all">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border bg-gray-50 focus:bg-white outline-none"
            />

            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price (₹)"
              className="w-full px-4 py-3 rounded-2xl border bg-gray-50 focus:bg-white outline-none"
            />
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing <b>{filtered.length}</b> event{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        {/* Events List */}
        {loadingEvents ? (
          <div className="p-6 rounded-3xl bg-white border shadow-sm text-gray-600">
            Loading events...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 rounded-3xl bg-white border shadow-sm text-gray-600">
            No events found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((e) => {
              const left = seatsLeft(e);
              const soldOut = left <= 0;
              const img = e.image ? makeFileUrl(e.image) : "";

              return (
                <div
                  key={e.id}
                  className={`rounded-3xl overflow-hidden bg-white border border-gray-200/60 shadow-sm transition-all ${
                    soldOut ? "opacity-70" : "hover:shadow-lg hover:-translate-y-1"
                  }`}
                >
                  <div className="h-44 bg-gray-100 relative">
                    {img ? (
                      <img src={img} alt={e.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                    <div className="absolute top-4 left-4 bg-cyan-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow">
                      {e.city || "CITY"}
                    </div>

                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow">
                      {Number(e.price || 0) === 0 ? "FREE" : `₹${e.price}`}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="font-black text-gray-900 text-lg">{e.title}</div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyan-600" />
                        <span>{safe(e.venue)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-cyan-600" />
                        <span>{formatDateTime(e.start_datetime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-600" />
                        <span>{left} seats left</span>
                      </div>
                    </div>

                    {e.description ? (
                      <div className="text-sm text-gray-700 line-clamp-2">{e.description}</div>
                    ) : null}

                    <button
                      disabled={soldOut}
                      onClick={() => !soldOut && openBooking(e)}
                      className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 ${
                        soldOut
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:opacity-95"
                      }`}
                      type="button"
                    >
                      <Ticket className="w-5 h-5" />
                      {soldOut ? "Sold Out" : "Book Now"}
                      {!soldOut ? <ArrowRight className="w-4 h-4" /> : null}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* My Bookings */}
        <div className="space-y-3">
          <div className="text-2xl font-black text-gray-900">My Event Bookings</div>

          <div className="bg-white border border-gray-200/60 shadow-sm rounded-3xl overflow-hidden">
            {loadingBookings ? (
              <div className="p-6 text-gray-600">Loading bookings...</div>
            ) : myBookings.length === 0 ? (
              <div className="p-6 text-gray-600">No bookings found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left">Booking ID</th>
                      <th className="px-4 py-3 text-left">Event</th>
                      <th className="px-4 py-3 text-left">Tickets</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Booked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBookings.slice(0, 10).map((b) => (
                      <tr key={b.id || b.booking_id} className="border-t">
                        <td className="px-4 py-3 font-semibold">#{b.id || b.booking_id}</td>
                        <td className="px-4 py-3">{b.event_title || "-"}</td>
                        <td className="px-4 py-3">{b.qty || "-"}</td>
                        <td className="px-4 py-3">₹{b.total_amount || "-"}</td>
                        <td className="px-4 py-3">{b.status || "-"}</td>
                        <td className="px-4 py-3">{b.created_at || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
