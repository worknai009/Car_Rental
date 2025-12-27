import { Box, Button, TextField } from "@mui/material";

const AddCar = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Car Added");
  };

  return (
    <Box m="20px">
      <h2>Add Car</h2>

      <form onSubmit={handleSubmit}>
        <TextField label="Car Name" fullWidth required sx={{ mb: 2 }} />
        <TextField label="Price per Day" type="number" fullWidth required sx={{ mb: 2 }} />
        <Button type="submit" variant="contained">
          Save
        </Button>
      </form>
    </Box>
  );
};

export default AddCar;
