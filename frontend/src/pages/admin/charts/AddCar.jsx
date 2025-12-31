import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography
} from "@mui/material";
import Header from "../../../components/admin/Header";
import { useState, useEffect } from "react";
import axios from "axios";

const AddCar = () => {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    car_details: "",
    category_id: "",
    price_per_day: "",
    is_available: 1
  });

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🔹 Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:1000/admin/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!image) {
    alert("Please upload a car image!");
    return;
  }

  if (!form.category_id || !form.price_per_day) {
    alert("Category and Price are required!");
    return;
  }

  const formData = new FormData();
  Object.keys(form).forEach(key => formData.append(key, form[key]));
  formData.append("cars_image", image);

  try {
    const res = await axios.post("http://localhost:1000/admin/cars", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    alert(res.data.message);
    setForm({ name: "", brand: "", car_details: "", category_id: "", price_per_day: "", is_available: 1 });
    setImage(null);
    setPreview(null);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Failed to add car");
  }
};


return (
  <Box p={3}>
    <Header title="Add Car" subtitle="Create a new car listing" />

    <Grid container justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <Card sx={{ mt: 3, p: 3, borderRadius: 3 }}>
          <Typography variant="h6" mb={3} fontWeight="bold">
            Car Details
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Car Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Car Name"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </Grid>

              {/* Brand */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  name="brand"
                  required
                  value={form.brand}
                  onChange={handleChange}
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="category_id"
                  required
                  value={form.category_id}
                  onChange={handleChange}
                >
                  <MenuItem value="">Select Category</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Price */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price Per Day (₹)"
                  name="price_per_day"
                  type="number"
                  required
                  value={form.price_per_day}
                  onChange={handleChange}
                />
              </Grid>

              {/* Availability */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Availability"
                  name="is_available"
                  value={form.is_available}
                  onChange={handleChange}
                >
                  <MenuItem value={1}>Available</MenuItem>
                  <MenuItem value={0}>Not Available</MenuItem>
                </TextField>
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  component="label"
                  sx={{ height: 56 }}
                >
                  Upload Car Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Grid>

              {/* Image Preview */}
              {preview && (
                <Grid item xs={12}>
                  <Card
                    sx={{
                      maxWidth: 250,
                      p: 1,
                      borderRadius: 2,
                      boxShadow: 2
                    }}
                  >
                    <img
                      src={preview}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 8
                      }}
                    />
                  </Card>
                </Grid>
              )}

              {/* Car Details */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Car Description"
                  name="car_details"
                  multiline
                  rows={4}
                  value={form.car_details}
                  onChange={handleChange}
                />
              </Grid>

              {/* Submit */}
              <Grid item xs={12} textAlign="right">
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="large"
                  sx={{ px: 5 }}
                >
                  Save Car
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

};

export default AddCar;
