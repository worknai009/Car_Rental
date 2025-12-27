import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

const CarList = () => {
  const cars = [
    { id: 1, name: "BMW X5", price: 4500 },
    { id: 2, name: "Audi A6", price: 4200 },
  ];

  return (
    <Box m="20px">
      <h2>Cars</h2>

      <Button
        component={Link}
        to="/admin/cars/add"
        variant="contained"
        sx={{ mb: 2 }}
      >
        Add Car
      </Button>

      {cars.map(car => (
        <Box key={car.id} sx={{ p: 2, border: "1px solid #ddd", mb: 1 }}>
          <b>{car.name}</b> — ₹{car.price}
          <Button
            component={Link}
            to={`/admin/cars/edit/${car.id}`}
            sx={{ ml: 2 }}
          >
            Edit
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default CarList;
