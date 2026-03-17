import {
  Box,
  Typography,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import Header from "../../components/admin/Header";
import adminApi from "../../utils/adminApi";
import { RefreshCw, Eye } from "lucide-react";

const STATUS_OPTIONS = ["ALL", "ACTIVE", "INACTIVE", "BLOCKED", "PENDING"];

const safe = (v) => (v === null || v === undefined || v === "" ? "-" : String(v));

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return safe(dateStr);
  return d.toISOString().split("T")[0];
};

const StatusChip = ({ value }) => {
  const s = String(value || "").toUpperCase();
  const color =
    s === "ACTIVE"
      ? "success"
      : s === "BLOCKED"
      ? "error"
      : s === "INACTIVE"
      ? "warning"
      : "info";
  return <Chip size="small" label={s || "-"} color={color} variant="outlined" />;
};

const CarRegisterUsers = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");

  // details modal
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = {};
      if (q.trim()) params.q = q.trim();
      if (status !== "ALL") params.status = status;

      const res = await adminApi.get("/admin/car-register-users", { params });
      const data = Array.isArray(res.data) ? res.data : [];

      setRows(
        data.map((u) => ({
          ...u,
          id: u.id, // DataGrid needs id
          status: String(u.status || "").toUpperCase(),
        }))
      );
    } catch (err) {
      console.error("fetch car-register-users error:", err);
      alert(err?.response?.data?.message || "Failed to fetch car register users");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const openDetails = async (id) => {
    setOpen(true);
    setDetails(null);
    setDetailsLoading(true);

    try {
      const res = await adminApi.get(`/admin/car-register-users/${id}`);
      setDetails(res.data || null);
    } catch (err) {
      console.error("details error:", err);
      alert(err?.response?.data?.message || "Failed to load details");
      setOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setOpen(false);
    setDetails(null);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const s = String(newStatus || "").toUpperCase();

      await adminApi.patch(`/admin/car-register-users/${id}/status`, { status: s });

      // update UI
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: s } : r)));

      // update modal too
      setDetails((prev) => (prev?.id === id ? { ...prev, status: s } : prev));
    } catch (err) {
      console.error("update status error:", err);
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 90 },
      { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
      { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
      { field: "phone", headerName: "Phone", minWidth: 150 },
      { field: "role", headerName: "Role", minWidth: 140 },

      {
        field: "status",
        headerName: "Status",
        minWidth: 200,
        renderCell: (params) => (
          <Select
            size="small"
            value={String(params.value || "").toUpperCase()}
            onChange={(e) => updateStatus(params.row.id, e.target.value)}
            sx={{ width: "100%" }}
          >
            {STATUS_OPTIONS.filter((s) => s !== "ALL").map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        ),
      },

      {
        field: "created_at",
        headerName: "Created",
        minWidth: 140,
        renderCell: (p) => <span>{formatDate(p.value)}</span>,
      },
      {
        field: "updated_at",
        headerName: "Updated",
        minWidth: 140,
        renderCell: (p) => <span>{formatDate(p.value)}</span>,
      },

      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <IconButton onClick={() => openDetails(params.row.id)} title="View">
            <Eye size={18} />
          </IconButton>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Box m="20px">
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Header
          title="CAR REGISTER USERS"
          subtitle="List + search + update status"
        />
        <IconButton onClick={fetchUsers} title="Refresh">
          <RefreshCw size={18} />
        </IconButton>
      </Box>

      {/* Filters */}
      <Box
        mt="14px"
        display="flex"
        gap="12px"
        flexWrap="wrap"
        alignItems="center"
      >
        <TextField
          size="small"
          label="Search (name/email/phone)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchUsers();
          }}
          sx={{ minWidth: 280 }}
        />

        <Button variant="outlined" onClick={fetchUsers}>
          Search
        </Button>

        <Select
          size="small"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Table */}
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

      {/* Details Modal */}
      <Dialog open={open} onClose={closeDetails} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>

        <DialogContent dividers>
          {detailsLoading ? (
            <Typography>Loading...</Typography>
          ) : !details ? (
            <Typography>No details found.</Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap="10px">
              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={700}>ID</Typography>
                <Typography>{safe(details.id)}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={700}>Name</Typography>
                <Typography>{safe(details.name)}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={700}>Email</Typography>
                <Typography>{safe(details.email)}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={700}>Phone</Typography>
                <Typography>{safe(details.phone)}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={700}>Status</Typography>
                <Box display="flex" gap="10px" alignItems="center">
                  <StatusChip value={details.status} />
                  <Select
                    size="small"
                    value={String(details.status || "").toUpperCase()}
                    onChange={(e) => updateStatus(details.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.filter((s) => s !== "ALL").map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={700}>Role</Typography>
                <Typography>{safe(details.role)}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={700}>Created</Typography>
                <Typography>{formatDate(details.created_at)}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={700}>Updated</Typography>
                <Typography>{formatDate(details.updated_at)}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarRegisterUsers;
