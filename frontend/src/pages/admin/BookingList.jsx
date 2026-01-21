import {
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Checkbox,
  Select,
  MenuItem,
  Collapse,
  Divider,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Header from "../../components/admin/Header";
import adminApi from "../../utils/adminApi";
import {
  RefreshCw,
  Eye,
  Printer,
  Trash2,
  User,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  IndianRupee,
  Car,
  Clock,
} from "lucide-react";

// ✅ Use UPPERCASE only (DB best practice)
const STATUS_OPTIONS = [
  "BOOKED",
  "APPROVED",
  "CONFIRMED",
  "PAID",
  "COMPLETED",
  "CANCELLED",
];

// ✅ Safe date formatter (no timezone shifting)
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr))) return String(dateStr);

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// ✅ Convert any incoming status into one of STATUS_OPTIONS
const normalizeStatus = (s) => {
  if (!s) return "BOOKED";
  const v = String(s).trim().toUpperCase();

  if (v === "CANCELED") return "CANCELLED";
  if (v === "PENDING") return "BOOKED";

  if (STATUS_OPTIONS.includes(v)) return v;
  return "BOOKED";
};

const labelStatus = (s) => {
  const v = normalizeStatus(s);
  return v.charAt(0) + v.slice(1).toLowerCase();
};

const StatusChip = ({ value }) => {
  const s = normalizeStatus(value);
  const color =
    s === "PAID" || s === "COMPLETED"
      ? "success"
      : s === "CANCELLED"
      ? "error"
      : s === "APPROVED" || s === "CONFIRMED"
      ? "info"
      : "warning";

  return (
    <Chip size="small" label={labelStatus(s)} color={color} variant="outlined" />
  );
};

const safeText = (v) => {
  if (v === null || v === undefined || v === "") return "-";
  return String(v);
};

const BookingList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state (for invoice)
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // checkbox state (like screenshot)
  const [checkedMap, setCheckedMap] = useState({});

  // ✅ expand state + cache to show ALL details inside card
  const [expandedMap, setExpandedMap] = useState({});
  const [detailsCache, setDetailsCache] = useState({});
  const [detailsLoadingMap, setDetailsLoadingMap] = useState({});

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/bookings");
      const data = Array.isArray(res.data) ? res.data : [];

      const normalized = data.map((r) => ({
        ...r,
        id: r.id ?? r.booking_id,
        booking_id: r.booking_id ?? r.id,
        status: normalizeStatus(r.status),

        // dates + amount
        start_date: r.start_date ?? r.startDate ?? r.from_date ?? r.fromDate ?? null,
        end_date: r.end_date ?? r.endDate ?? r.to_date ?? r.toDate ?? null,
        total_amount: r.total_amount ?? r.totalAmount ?? r.amount ?? null,

        // support phone/message fields for inquire UI
        user_phone: r.user_phone ?? r.phone ?? r.mobile ?? r.contact ?? null,
        inquiry_text:
          r.inquiry_text ??
          r.message ??
          r.note ??
          r.query ??
          r.description ??
          r.remarks ??
          "",

        // extra fields if API returns them in list
        pickup_location: r.pickup_location ?? r.pickup ?? null,
        drop_location: r.drop_location ?? r.drop ?? null,
        car_name: r.car_name ?? r.car ?? null,
        car_brand: r.car_brand ?? r.brand ?? null,
        price_per_day: r.price_per_day ?? r.pricePerDay ?? null,
        created_at: r.created_at ?? r.createdAt ?? null,
        car_image: r.car_image ?? r.image ?? null,
      }));

      setRows(normalized);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      alert(err?.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ update booking status
  const updateStatus = async (id, newStatus) => {
    try {
      const status = normalizeStatus(newStatus);

      await adminApi.patch(`/admin/bookings/${id}/status`, { status });

      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

      // also update cached details if available
      setDetailsCache((prev) =>
        prev[id] ? { ...prev, [id]: { ...prev[id], status } } : prev
      );

      alert("Status updated ✅");
    } catch (err) {
      console.error("Update status error:", err);
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  const openDetails = async (id) => {
    setOpen(true);
    setDetails(null);
    setDetailsLoading(true);

    try {
      const res = await adminApi.get(`/admin/bookings/${id}`);
      const d = res.data || {};
      setDetails({
        ...d,
        booking_id: d.booking_id ?? d.id,
        status: normalizeStatus(d.status),
        start_date: d.start_date ?? d.startDate ?? d.from_date ?? d.fromDate ?? null,
        end_date: d.end_date ?? d.endDate ?? d.to_date ?? d.toDate ?? null,
        total_amount: d.total_amount ?? d.totalAmount ?? d.amount ?? null,
      });
    } catch (err) {
      console.error("Booking details error:", err);
      alert(err?.response?.data?.message || "Failed to load booking details");
      setOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setOpen(false);
    setDetails(null);
  };

  const printInvoice = () => {
    const el = document.getElementById("invoice-print-area");
    if (!el) return window.print();

    const w = window.open("", "", "width=900,height=650");
    w.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            .row { display:flex; justify-content:space-between; gap: 16px; margin: 6px 0; }
            .muted { color:#666; font-size: 14px; }
            .title { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
            .box { border:1px solid #ddd; border-radius: 10px; padding: 16px; margin-top: 12px; }
            img { max-width: 260px; border-radius: 10px; margin-top: 10px; }
            hr { border: none; border-top:1px solid #eee; margin: 14px 0; }
          </style>
        </head>
        <body>${el.innerHTML}</body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  // ✅ Delete (adjust API route if backend is different)
  const deleteBooking = async (id) => {
    try {
      const ok = window.confirm("Delete this inquiry/booking?");
      if (!ok) return;

      await adminApi.delete(`/admin/bookings/delete/${id}`);
      setRows((prev) => prev.filter((r) => r.id !== id));

      // cleanup UI states
      setCheckedMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setExpandedMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setDetailsCache((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

      alert("Deleted ✅");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err?.response?.data?.message || "Failed to delete");
    }
  };

  const toggleChecked = (id) => {
    setCheckedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ✅ Load full details (for card)
  const fetchFullDetailsForCard = async (id) => {
    // already cached
    if (detailsCache[id]) return;

    setDetailsLoadingMap((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await adminApi.get(`/admin/bookings/${id}`);
      const d = res.data || {};
      const normalized = {
        ...d,
        id: d.id ?? d.booking_id ?? id,
        booking_id: d.booking_id ?? d.id ?? id,
        status: normalizeStatus(d.status),
        start_date: d.start_date ?? d.startDate ?? d.from_date ?? d.fromDate ?? null,
        end_date: d.end_date ?? d.endDate ?? d.to_date ?? d.toDate ?? null,
        total_amount: d.total_amount ?? d.totalAmount ?? d.amount ?? null,

        user_phone: d.user_phone ?? d.phone ?? d.mobile ?? d.contact ?? null,
        inquiry_text:
          d.inquiry_text ??
          d.message ??
          d.note ??
          d.query ??
          d.description ??
          d.remarks ??
          "",

        pickup_location: d.pickup_location ?? d.pickup ?? null,
        drop_location: d.drop_location ?? d.drop ?? null,

        car_name: d.car_name ?? d.car ?? null,
        car_brand: d.car_brand ?? d.brand ?? null,
        price_per_day: d.price_per_day ?? d.pricePerDay ?? null,
        car_image: d.car_image ?? d.image ?? null,

        created_at: d.created_at ?? d.createdAt ?? null,
      };

      setDetailsCache((prev) => ({ ...prev, [id]: normalized }));
    } catch (err) {
      console.error("Card details error:", err);
      alert(err?.response?.data?.message || "Failed to load full details");
    } finally {
      setDetailsLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  const toggleExpand = async (id) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    // when opening, fetch full details once
    const willOpen = !expandedMap[id];
    if (willOpen) await fetchFullDetailsForCard(id);
  };

  const listRows = useMemo(() => (Array.isArray(rows) ? rows : []), [rows]);

  // small row line component
  const Line = ({ icon, label, value }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        minWidth: 240,
        flex: "1 1 240px",
      }}
    >
      <Box sx={{ mt: "2px" }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontSize: 12, color: "#6b7280" }}>{label}</Typography>
        <Typography sx={{ fontSize: 14, color: "#111827", fontWeight: 600 }}>
          {safeText(value)}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box m="20px">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Header
          title="BOOKINGS / INQUIRIES"
          subtitle="Card format (like your image) + show ALL details + status update + invoice + delete"
        />
        <IconButton onClick={fetchBookings} title="Refresh">
          <RefreshCw size={18} />
        </IconButton>
      </Box>

      {loading ? (
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
      ) : listRows.length === 0 ? (
        <Typography sx={{ mt: 2 }}>No data found.</Typography>
      ) : (
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {listRows.map((r, idx) => {
            const expanded = !!expandedMap[r.id];
            const full = detailsCache[r.id] || {};
            const d = { ...r, ...full }; // combine list row + full details

            return (
              <Box
                key={r.id}
                sx={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 3,
                  p: 2,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                }}
              >
                {/* TOP ROW */}
                <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                  <Typography sx={{ fontSize: 20, fontWeight: 800 }}>
                    #{idx + 1} . Car Booking inquire
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    {/* status update (like table but in card) */}
                    <Select
                      size="small"
                      value={normalizeStatus(d.status)}
                      onChange={(e) => updateStatus(d.id, e.target.value)}
                      sx={{ minWidth: 150 }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>
                          {labelStatus(s)}
                        </MenuItem>
                      ))}
                    </Select>

                    <IconButton onClick={() => toggleExpand(d.id)} title="Show all details">
                      {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </IconButton>

                    <IconButton onClick={() => openDetails(d.id)} title="View invoice/details">
                      <Eye size={18} />
                    </IconButton>

                    <IconButton
                      onClick={async () => {
                        await openDetails(d.id);
                        setTimeout(() => printInvoice(), 350);
                      }}
                      title="Print invoice"
                    >
                      <Printer size={18} />
                    </IconButton>

                    <Button
                      onClick={() => deleteBooking(d.id)}
                      startIcon={<Trash2 size={18} />}
                      sx={{
                        textTransform: "none",
                        borderRadius: 3,
                        px: 2,
                        backgroundColor: "#fde2e2",
                        color: "#d11a2a",
                        boxShadow: "none",
                        "&:hover": { backgroundColor: "#fbd0d0", boxShadow: "none" },
                      }}
                      variant="contained"
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>

                {/* SUMMARY LINE (like screenshot icons) */}
                <Box
                  sx={{
                    mt: 1.2,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 3,
                    color: "#111827",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <User size={18} />
                    <Typography>{safeText(d.user_name)}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Mail size={18} />
                    <Typography>{safeText(d.user_email)}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Phone size={18} />
                    <Typography>{safeText(d.user_phone)}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <StatusChip value={d.status} />
                  </Box>
                </Box>

                {/* MESSAGE LINE (checkbox + text like screenshot) */}
                <Box sx={{ mt: 1.2, display: "flex", alignItems: "center", gap: 1 }}>
                  <Checkbox checked={!!checkedMap[d.id]} onChange={() => toggleChecked(d.id)} />
                  <Typography sx={{ color: "#111827" }}>
                    {safeText(d.inquiry_text)}
                  </Typography>
                </Box>

                {/* ✅ ALL DETAILS SECTION */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <Divider sx={{ my: 2 }} />

                  {detailsLoadingMap[d.id] ? (
                    <Typography sx={{ color: "#6b7280" }}>Loading full details...</Typography>
                  ) : (
                    <>
                      <Typography sx={{ fontWeight: 800, mb: 1, color: "#111827" }}>
                        All Details
                      </Typography>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        <Line icon={<Clock size={16} />} label="Booking ID" value={d.booking_id} />
                        <Line icon={<Clock size={16} />} label="Created At" value={d.created_at} />

                        <Line icon={<Calendar size={16} />} label="Start Date" value={formatDate(d.start_date)} />
                        <Line icon={<Calendar size={16} />} label="End Date" value={formatDate(d.end_date)} />

                        <Line icon={<IndianRupee size={16} />} label="Total Amount" value={`₹${safeText(d.total_amount)}`} />
                        <Line icon={<IndianRupee size={16} />} label="Price / Day" value={`₹${safeText(d.price_per_day)}`} />

                        <Line icon={<MapPin size={16} />} label="Pickup Location" value={d.pickup_location} />
                        <Line icon={<MapPin size={16} />} label="Drop Location" value={d.drop_location} />

                        <Line icon={<Car size={16} />} label="Car Name" value={d.car_name} />
                        <Line icon={<Car size={16} />} label="Car Brand" value={d.car_brand} />

                        <Line icon={<User size={16} />} label="Customer Name" value={d.user_name} />
                        <Line icon={<Mail size={16} />} label="Customer Email" value={d.user_email} />
                        <Line icon={<Phone size={16} />} label="Customer Phone" value={d.user_phone} />
                      </Box>

                      {/* Car Image */}
                      {d.car_image ? (
                        <Box sx={{ mt: 2 }}>
                          <Typography sx={{ fontSize: 12, color: "#6b7280" }}>Car Image</Typography>
                          <Box
                            component="img"
                            alt="car"
                            src={`http://localhost:1000${d.car_image}`}
                            sx={{
                              mt: 1,
                              width: "100%",
                              maxWidth: 320,
                              borderRadius: 2,
                              border: "1px solid #e5e7eb",
                            }}
                          />
                        </Box>
                      ) : null}
                    </>
                  )}
                </Collapse>
              </Box>
            );
          })}
        </Box>
      )}

      {/* DETAILS MODAL (same invoice modal from your old code) */}
      <Dialog open={open} onClose={closeDetails} maxWidth="md" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>

        <DialogContent dividers>
          {detailsLoading ? (
            <Typography>Loading...</Typography>
          ) : !details ? (
            <Typography>No details found.</Typography>
          ) : (
            <div id="invoice-print-area">
              <div className="title">Car Rental Invoice</div>
              <div className="muted">Booking ID: #{safeText(details.booking_id)}</div>

              <div className="box">
                <div className="row">
                  <b>Status</b>
                  <span>
                    <StatusChip value={details.status} />
                  </span>
                </div>
                <div className="row">
                  <b>Total Amount</b>
                  <span>₹{safeText(details.total_amount)}</span>
                </div>
                <div className="row">
                  <b>Start Date</b>
                  <span>{formatDate(details.start_date)}</span>
                </div>
                <div className="row">
                  <b>End Date</b>
                  <span>{formatDate(details.end_date)}</span>
                </div>
                <hr />
                <div className="row">
                  <b>Pickup</b>
                  <span>{safeText(details.pickup_location)}</span>
                </div>
                <div className="row">
                  <b>Drop</b>
                  <span>{safeText(details.drop_location)}</span>
                </div>
                <div className="row">
                  <b>Created At</b>
                  <span>{safeText(details.created_at)}</span>
                </div>
              </div>

              <div className="box">
                <div className="title" style={{ fontSize: 16 }}>
                  Customer
                </div>
                <div className="row">
                  <b>Name</b>
                  <span>{safeText(details.user_name)}</span>
                </div>
                <div className="row">
                  <b>Email</b>
                  <span>{safeText(details.user_email)}</span>
                </div>
                
              </div>

              <div className="box">
                <div className="title" style={{ fontSize: 16 }}>
                  Car
                </div>
                <div className="row">
                  <b>Name</b>
                  <span>{safeText(details.car_name)}</span>
                </div>
                <div className="row">
                  <b>Brand</b>
                  <span>{safeText(details.car_brand)}</span>
                </div>
                <div className="row">
                  <b>Price/Day</b>
                  <span>₹{safeText(details.price_per_day)}</span>
                </div>

                {details.car_image ? (
                  <img src={`http://localhost:1000${details.car_image}`} alt="car" />
                ) : null}
              </div>
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDetails}>Close</Button>
          <Button
            onClick={printInvoice}
            variant="contained"
            startIcon={<Printer size={18} />}
            disabled={!details}
          >
            Print / Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingList;
