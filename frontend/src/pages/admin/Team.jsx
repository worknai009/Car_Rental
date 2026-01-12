import { Box, Typography, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../../components/admin/Header";
import adminApi from "../../utils/adminApi";

const Team = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/admin/users");
      // DataGrid needs "id" field -> your API already returns id ✅
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch users error:", err);
      alert(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await adminApi.delete(`/admin/users/${id}`);
      setRows((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete user error:", err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
    {
      field: "created_at",
      headerName: "Created At",
      flex: 1,
      minWidth: 180,
      valueGetter: (params) => {
        const v = params.row?.created_at;
        if (!v) return "";
        return new Date(v).toLocaleString();
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => deleteUser(params.row.id)}>
          <Trash2 size={18} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="USERS" subtitle="All registered users from database" />

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
          pageSizeOptions={[5, 10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
        />
      </Box>
    </Box>
  );
};

export default Team;
