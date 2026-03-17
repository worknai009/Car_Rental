import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/admin/Header";

// Mock Data - In a real app, this comes from your database/API
const mockDataInvoices = [
  { id: 1, name: "Rahul Sharma", email: "rahul@gmail.com", cost: "5500", phone: "9876543210", date: "12/01/2025" },
  { id: 2, name: "Anita Desai", email: "anita@outlook.com", cost: "12000", phone: "9123456789", date: "12/05/2025" },
  { id: 3, name: "Vikram Singh", email: "vikram@yahoo.com", cost: "8500", phone: "9988776655", date: "12/10/2025" },
  { id: 4, name: "Sanya Malhotra", email: "sanya@gmail.com", cost: "4200", phone: "9445566778", date: "12/15/2025" },
  { id: 5, name: "Amit Patel", email: "amitp@gmail.com", cost: "15500", phone: "9332211445", date: "12/20/2025" },
];

const Invoices = () => {
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "cost",
      headerName: "Cost (₹)",
      flex: 1,
      renderCell: (params) => (
        <Typography color="#16a34a" sx={{ mt: "14px" }}>
          ₹{params.row.cost}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="List of Invoice Balances for Car Rentals" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: "#dc2626", // Brand Red for names
            fontWeight: "bold"
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#111827", // Dark Gray/Black
            color: "#ffffff",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#111827",
            color: "white"
          },
          "& .MuiCheckbox-root": {
            color: `#dc2626 !important`,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
             color: "white"
          }
        }}
      >
        <DataGrid 
          checkboxSelection 
          rows={mockDataInvoices} 
          columns={columns} 
        />
      </Box>
    </Box>
  );
};

export default Invoices;