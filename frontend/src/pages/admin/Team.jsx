import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";
import Header from "../../components/admin/Header";

// Mock Data for your Car Rental Team
const mockDataTeam = [
  { id: 1, name: "Ankit Lal Sinha", email: "ankit@gmail.com", age: 28, phone: "8210129246", access: "admin" },
  { id: 2, name: "Siddhant Dhomse", email: "siddhant@gmail.com", age: 31, phone: "8668231882", access: "manager" },
  { id: 3, name: "Sonali Ekhande", email: "sonali@gmail.com", age: 24, phone: "8767465122", access: "user" },
  { id: 4, name: "Aboli Kulkarni", email: "aboli@gmail.com", age: 22, phone: "7776033429", access: "user" },
  { id: 5, name: "Savita Mali", email: "savita@gmail.com", age: 26, phone: "8262931158", access: "manager" },
];

const Team = () => {
  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "age", headerName: "Age", type: "number", headerAlign: "left", align: "left" },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            m="10px auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin" ? "#dc2626" : access === "manager" ? "#111827" : "#4b5563"
            }
            borderRadius="4px"
          >
            {access === "admin" && <ShieldAlert size={18} className="text-white mr-2" />}
            {access === "manager" && <ShieldCheck size={18} className="text-white mr-2" />}
            {access === "user" && <User size={18} className="text-white mr-2" />}
            <Typography color="white" sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Staff Members and Roles" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: "#dc2626", fontWeight: "bold" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: "#111827", color: "white" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: "#ffffff" },
          "& .MuiDataGrid-footerContainer": { backgroundColor: "#111827", color: "white" },
          "& .MuiDataGrid-columnHeaderTitle": { color: "white" }
        }}
      >
        <DataGrid rows={mockDataTeam} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;