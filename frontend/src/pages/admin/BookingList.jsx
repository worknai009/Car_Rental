import {
  Box,
  Typography,
  IconButton,
  MenuItem,
  Select,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import Header from "../../components/admin/Header";
import adminApi from "../../utils/adminApi";
import { RefreshCw, Eye, Printer } from "lucide-react";

// ✅ Use UPPERCASE only (DB best practice)
const STATUS_OPTIONS = [
  "BOOKED",
  "APPROVED",
  "CONFIRMED",
  "PAID",
  "COMPLETED",
  "CANCELLED",
];

// ✅ Convert any incoming status into one of STATUS_OPTIONS
const normalizeStatus = (s) => {
  if (!s) return "BOOKED";
  const v = String(s).trim().toUpperCase();

  // common variations
  if (v === "CANCELED") return "CANCELLED";
  if (v === "PENDING") return "BOOKED";

  // if value is known, return it
  if (STATUS_OPTIONS.includes(v)) return v;

  return "BOOKED";
};

const labelStatus = (s) => {
  const v = normalizeStatus(s);
  // prettier display
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
  return <Chip size="small" label={labelStatus(s)} color={color} variant="outlined" />;
};

const safeText = (v) => {
  if (v === null || v === undefined || v === "") return "-";
  return String(v);
};

const BookingList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/bookings");
      const data = Array.isArray(res.data) ? res.data : [];

      const normalized = data.map((r) => ({
        ...r,
        id: r.id ?? r.booking_id, // DataGrid needs id
        status: normalizeStatus(r.status),
        start_date: r.start_date ?? r.startDate ?? r.from_date ?? r.fromDate ?? null,
        end_date: r.end_date ?? r.endDate ?? r.to_date ?? r.toDate ?? null,
        total_amount: r.total_amount ?? r.totalAmount ?? r.amount ?? null,
      }));

      console.log("Bookings sample:", normalized[0]);
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

  // ✅ FIXED: use setRows (not setBookings)
const updateStatus = async (id, newStatus) => {
  try {
    const status = normalizeStatus(newStatus);

    // ✅ match backend route
    await adminApi.patch(`/admin/bookings/${id}/status`, { status });

    // ✅ update UI immediately
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

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
        status: normalizeStatus(d.status),
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

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 80 },

      { field: "user_name", headerName: "User", flex: 1, minWidth: 160 },
      { field: "user_email", headerName: "Email", flex: 1, minWidth: 220 },
      { field: "car_name", headerName: "Car", flex: 1, minWidth: 160 },

      { field: "pickup_location", headerName: "Pickup", flex: 1, minWidth: 160 },
      { field: "drop_location", headerName: "Drop", flex: 1, minWidth: 160 },

      {
        field: "start_date",
        headerName: "Start Date",
        minWidth: 140,
        renderCell: (p) => <span>{safeText(p.value)}</span>,
      },
      {
        field: "end_date",
        headerName: "End Date",
        minWidth: 140,
        renderCell: (p) => <span>{safeText(p.value)}</span>,
      },

      {
        field: "total_amount",
        headerName: "Amount",
        minWidth: 120,
        renderCell: (p) => <span>₹{safeText(p.value)}</span>,
      },

      {
        field: "status",
        headerName: "Status",
        minWidth: 180,
        renderCell: (params) => {
          const current = normalizeStatus(params.row.status);

          return (
            <Select
              size="small"
              value={current}
              onChange={(e) => updateStatus(params.row.id, e.target.value)}
              sx={{ width: "100%" }}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {labelStatus(s)}
                </MenuItem>
              ))}
            </Select>
          );
        },
      },

      {
        field: "created_at",
        headerName: "Created At",
        minWidth: 190,
        renderCell: (p) => <span>{safeText(p.value)}</span>,
      },

      {
        field: "actions",
        headerName: "Actions",
        width: 140,
        sortable: false,
        renderCell: (params) => (
          <Box display="flex" gap="6px">
            <IconButton onClick={() => openDetails(params.row.id)} title="View details">
              <Eye size={18} />
            </IconButton>
            <IconButton
              onClick={async () => {
                await openDetails(params.row.id);
                setTimeout(() => printInvoice(), 350);
              }}
              title="Print invoice"
            >
              <Printer size={18} />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <Box m="20px">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Header title="BOOKINGS" subtitle="All bookings + update status + invoice" />
        <IconButton onClick={fetchBookings}>
          <RefreshCw size={18} />
        </IconButton>
      </Box>

      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: "#111827", color: "white" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: "#ffffff" },
          "& .MuiDataGrid-footerContainer": { backgroundColor: "#111827", color: "white" },
          "& .MuiDataGrid-columnHeaderTitle": { color: "white" },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25, page: 0 } },
          }}
          disableRowSelectionOnClick
        />
      </Box>

      {/* DETAILS MODAL */}
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
              <div className="muted">Booking ID: #{details.booking_id}</div>

              <div className="box">
                <div className="row">
                  <b>Status</b>
                  <span><StatusChip value={details.status} /></span>
                </div>
                <div className="row"><b>Total Amount</b><span>₹{safeText(details.total_amount)}</span></div>
                <div className="row"><b>Start Date</b><span>{safeText(details.start_date)}</span></div>
                <div className="row"><b>End Date</b><span>{safeText(details.end_date)}</span></div>
                <hr />
                <div className="row"><b>Pickup</b><span>{safeText(details.pickup_location)}</span></div>
                <div className="row"><b>Drop</b><span>{safeText(details.drop_location)}</span></div>
                <div className="row"><b>Created At</b><span>{safeText(details.created_at)}</span></div>
              </div>

              <div className="box">
                <div className="title" style={{ fontSize: 16 }}>Customer</div>
                <div className="row"><b>Name</b><span>{safeText(details.user_name)}</span></div>
                <div className="row"><b>Email</b><span>{safeText(details.user_email)}</span></div>
              </div>

              <div className="box">
                <div className="title" style={{ fontSize: 16 }}>Car</div>
                <div className="row"><b>Name</b><span>{safeText(details.car_name)}</span></div>
                <div className="row"><b>Brand</b><span>{safeText(details.car_brand)}</span></div>
                <div className="row"><b>Price/Day</b><span>₹{safeText(details.price_per_day)}</span></div>

                {details.car_image ? (
                  <img
                    src={`http://localhost:1000/public/${details.car_image}`}
                    alt="car"
                  />
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
