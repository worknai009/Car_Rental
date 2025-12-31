import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/admin/Header";
import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:1000/admin/users");
      setRows(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

const deleteUser = async (id) => {
  if (!window.confirm("Are you sure?")) return;

  try {
    const res = await axios.delete(`http://localhost:1000/admin/users/${id}`);
    console.log(res.data);
    fetchUsers();
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
};

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell"
    },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => deleteUser(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Users List" subtitle="Manage system users" />

      <Box
        m="40px 0 0 0"
        height="75vh" >
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default Users;
