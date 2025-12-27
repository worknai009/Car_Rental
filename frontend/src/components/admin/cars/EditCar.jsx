import { Box, Button, TextField } from "@mui/material";
import { useParams } from "react-router-dom";

const EditCar = () => {
  const { id } = useParams();

  const handleUpdate = (e) => {
    e.preventDefault();
    alert(`Car ${id} Updated`);
  };

  return (
    <Box m="20px">
      <h2>Edit Car</h2>

      <form onSubmit={handleUpdate}>
        <TextField label="Car Name" defaultValue="BMW X5" fullWidth sx={{ mb: 2 }} />
        <TextField label="Price per Day" type="number" defaultValue="4500" fullWidth sx={{ mb: 2 }} />
        <Button type="submit" variant="contained">
          Update
        </Button>
      </form>
    </Box>
  );
};

export default EditCar;
