import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Stack
} from "@mui/material";
import Header from "../../../components/admin/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // <- Import this

const CarList = () => {
    const [cars, setCars] = useState([]);
    const navigate = useNavigate(); // <- Initialize navigate

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const res = await axios.get("http://localhost:1000/admin/cars");
            console.log("Cars fetched:", res.data);
            setCars(res.data);
        } catch (error) {
            console.error("Failed to fetch cars", error.response ? error.response.data : error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;

        try {
            await axios.delete(`http://localhost:1000/admin/cars/${id}`);
            alert("Car deleted successfully");
            fetchCars();
        } catch (error) {
            console.error(error);
            alert("Failed to delete car");
        }
    };

    const handleEdit = (car) => {
        navigate(`/admin/editcar/${car.id}`); // <- Works now
    };

    const toggleAvailability = async (id, currentStatus) => {
        try {
            await axios.put(
                `http://localhost:1000/admin/cars/${id}/availability`,
                { is_available: currentStatus ? 0 : 1 }
            );
            fetchCars();
        } catch (error) {
            console.error(error);
            alert("Failed to update availability");
        }
    };

    return (
        <Box p={3}>
            <Header title="Car List" subtitle="All registered cars" />

            <Grid container spacing={3}>
                {cars.length === 0 && (
                    <Typography variant="h6" m={3}>
                        No cars found.
                    </Typography>
                )}

                {cars.map((car) => (
                    <Grid item xs={12} sm={6} md={4} key={car.id}>
                        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                            {car.cars_image && (
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={`http://localhost:1000/${car.cars_image}`}
                                    alt={car.name}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold">
                                    {car.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Brand: {car.brand}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Price Per Day: ₹{car.price_per_day}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color={car.is_available ? "green" : "red"}
                                >
                                    {car.is_available ? "Available" : "Not Available"}
                                </Typography>

                                <Stack direction="row" spacing={1} mt={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEdit(car)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDelete(car.id)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={car.is_available ? "success" : "warning"}
                                        onClick={() => toggleAvailability(car.id, car.is_available)}
                                    >
                                        {car.is_available ? "Available" : "Not Available"}
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CarList;
