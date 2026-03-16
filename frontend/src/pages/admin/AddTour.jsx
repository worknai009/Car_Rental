import React, { useState, useEffect } from "react";
import { 
  Box, Button, TextField, Typography, 
  useTheme, useMediaQuery, Paper, 
  Switch, FormControlLabel, Grid, InputAdornment 
} from "@mui/material";
import { 
  Title, Description, AccessTime, 
  CurrencyRupee, DateRange, Image as ImageIcon,
  CheckCircle, InfoOutlined, Timeline,
  FactCheck, HighlightOff
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import adminApi from "../../utils/adminApi";
import Header from "../../components/admin/Header";

const AddTour = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    itinerary: "",
    inclusions: "",
    exclusions: "",
    tour_date: "",
    tour_time: "",
    is_active: true,
    routes: "",
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      adminApi.get(`/admin/tours/packages/${id}`)
        .then((res) => {
          const found = res.data;
          
          let routesStr = "";
          if (found.routes) {
            try {
              const routesArr = typeof found.routes === 'string' ? JSON.parse(found.routes) : found.routes;
              routesStr = Array.isArray(routesArr) ? routesArr.join(", ") : found.routes;
            } catch (e) {
              routesStr = found.routes;
            }
          }

          setFormData({
            title: found.title || "",
            description: found.description || "",
            duration: found.duration || "",
            price: found.price || "",
            itinerary: found.itinerary || "",
            inclusions: found.inclusions || "",
            exclusions: found.exclusions || "",
            tour_date: found.tour_date ? found.tour_date.slice(0, 10) : "",
            tour_time: found.tour_time || "",
            is_active: Boolean(found.is_active),
            routes: routesStr,
          });

          try {
            const imgs = typeof found.images === 'string' ? JSON.parse(found.images || "[]") : found.images;
            setExistingImages(Array.isArray(imgs) ? imgs : []);
          } catch (e) {
            setExistingImages([]);
          }
        })
        .catch(err => {
          console.error("Failed to fetch tour:", err);
          alert("Error loading tour details");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'routes') {
        const routesArr = formData.routes.split(",").map(r => r.trim()).filter(Boolean);
        data.append(key, JSON.stringify(routesArr));
      } else {
        data.append(key, formData[key]);
      }
    });
    
    if (images.length > 0) {
      images.forEach(img => data.append("images", img));
    }

    try {
      if (isEdit) {
        await adminApi.put(`/admin/tours/packages/${id}`, data);
        alert("Tour updated successfully!");
      } else {
        await adminApi.post("/admin/tours/packages", data);
        alert("Tour added successfully!");
      }
      navigate("/admin/tours");
    } catch (err) {
      console.error(err);
      alert("Failed to save tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Header title={isEdit ? "EDIT TOUR" : "ADD TOUR"} subtitle={isEdit ? "Update tour details" : "Create a new tour package"} />

      <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, mt: 3, borderRadius: "15px" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Tour Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Title color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Duration (e.g. 3 Days / 2 Nights)"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Price (₹)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupee color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Tour Start Date"
                name="tour_date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.tour_date}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Tour Start Time"
                name="tour_time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.tour_time}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                label="Short Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InfoOutlined color="primary" sx={{ mt: -5 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                label="Detailed Itinerary"
                name="itinerary"
                value={formData.itinerary}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Inclusions"
                name="inclusions"
                value={formData.inclusions}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Exclusions"
                name="exclusions"
                value={formData.exclusions}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Travel Routes (comma separated, e.g. Airport, Hotel, Beach)"
                name="routes"
                value={formData.routes}
                onChange={handleChange}
                placeholder="Route 1, Route 2, Route 3"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Timeline color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {isEdit && existingImages.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold", color: "text.secondary", textTransform: "uppercase" }}>
                  Current Images
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {existingImages.map((img, idx) => (
                    <Box key={idx} sx={{ width: 100, height: 100, borderRadius: "10px", overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
                      <img src={`${import.meta.env.VITE_API_URL}${img}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="tour" />
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ py: 1.5, bgcolor: theme.palette.info.main }}
              >
                {images.length > 0 ? `${images.length} Images Selected` : isEdit ? "Upload New Images (Replaces existing)" : "Upload Tour Images (Multiple)"}
                <input type="file" multiple hidden onChange={handleFileChange} />
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    color="primary"
                  />
                }
                label="Active / Visible to users"
              />
            </Grid>
          </Grid>

          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button variant="outlined" sx={{ mr: 2 }} onClick={() => navigate("/admin/tours")}>Cancel</Button>
            <Button 
              type="submit" 
              color="secondary" 
              variant="contained" 
              disabled={loading}
              sx={{ px: 5, py: 1.5, fontWeight: "bold" }}
            >
              {loading ? "Saving..." : isEdit ? "Update Tour" : "Create Tour"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddTour;
