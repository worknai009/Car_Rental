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
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../components/admin/Header";
import { useNavigate, useParams } from "react-router-dom";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchCar();
    fetchCategories();
  }, []);

  const fetchCar = async () => {
    try {
      const res = await axios.get(`http://localhost:1000/admin/cars`);
      const car = res.data.find((c) => c.id == id);
      setForm(car);
      setPreview(car.cars_image ? `http://localhost:1000/${car.cars_image}` : null);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:1000/admin/categories");
      setCategories(res.data);
    } catch (error) {
      console.error(error);
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
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (image) formData.append("cars_image", image);

    try {
      await axios.put(`http://localhost:1000/admin/cars/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Car updated successfully");
      navigate("/admin/carlist"); // Go back to car list
    } catch (error) {
      console.error(error);
      alert("Failed to update car");
    }
  };

  return (
    <Box p={3}>
      <Header title="Edit Car" subtitle="Update car information" />

      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Card sx={{ mt: 3, p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={3} fontWeight="bold">
              Car Details
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Car Name"
                    name="name"
                    required
                    value={form.name || ""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Brand"
                    name="brand"
                    required
                    value={form.brand || ""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Category"
                    name="category_id"
                    required
                    value={form.category_id || ""}
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

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Price Per Day (₹)"
                    name="price_per_day"
                    type="number"
                    required
                    value={form.price_per_day || ""}
                    onChange={handleChange}
                  />
                </Grid>

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

                {preview && (
                  <Grid item xs={12}>
                    <img
                      src={preview}
                      alt="preview"
                      style={{ width: 200, borderRadius: 8 }}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Car Description"
                    name="car_details"
                    multiline
                    rows={4}
                    value={form.car_details || ""}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} textAlign="right">
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    size="large"
                    sx={{ px: 5 }}
                  >
                    Update Car
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

export default EditCar;
