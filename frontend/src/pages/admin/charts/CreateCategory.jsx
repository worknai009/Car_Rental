import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography
} from "@mui/material";
import Header from "../../../components/admin/Header";
import { useState } from "react";
import axios from "axios";

const CreateCategory = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:1000/admin/categories", { name });
      alert("Category added successfully");
      setName("");
    } catch (error) {
      console.error(error);
      alert("Failed to add category");
    }
  };

  return (
    <Box m="20px">
      <Header title="Create Category" subtitle="Add new car category" />

      <Card sx={{ maxWidth: 500, mt: 4, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Category Information
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 2 }}
            >
              Create Category
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateCategory;
