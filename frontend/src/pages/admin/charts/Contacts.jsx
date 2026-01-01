import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../components/admin/Header";
import { useEffect, useState } from "react";
import axios from "axios";

const Contacts = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:1000/admin/contact");
      console.log("Contact API:", res.data); // Debug
      setRows(res.data);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`http://localhost:1000/admin/contact/${id}`);
      fetchContacts(); // Refresh list after deletion
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "subject", headerName: "Subject", flex: 1 },
    { field: "message", headerName: "Message", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => deleteContact(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Contact List" subtitle="View all contact messages" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
