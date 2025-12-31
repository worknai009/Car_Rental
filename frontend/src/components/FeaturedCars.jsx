import React, { useEffect, useState } from 'react'
import ScrollReveal from 'scrollreveal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Car, Fuel, Star, ArrowRight } from 'lucide-react'

const FeaturedCars = () => {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get('http://localhost:1000/cars')
        console.log('Cars fetched:', res.data)
        setCars(res.data)
      } catch (error) {
        console.error(
          'Failed to fetch cars:',
          error.response ? error.response.data : error.message
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCars()

    const sr = ScrollReveal({
      reset: false,
      distance: '60px',
      duration: 1200,
      easing: 'ease-in-out',
    })

    sr.reveal('.fc-card', { origin: 'bottom', interval: 200 })
    sr.reveal('.fc-img', { scale: 0.85, delay: 100 })
  }, [])

  // ✅ ONLY AVAILABLE CARS
  const availableCars = cars.filter(
    car => car.is_available == 1 || car.is_available === true
  )

  const handleBook = carId => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login first')
      navigate('/login')
      return
    }

    navigate('/booking', { state: { carId } })
  }

  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Loading featured cars...
      </p>
    )
  }

  return (
    <section className="my-20 px-5 max-w-6xl mx-auto flex flex-col gap-10">
      {/* Heading */}
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
          <Car className="w-8 h-8 text-red-600" />
          Featured Cars
        </h2>
        <p className="text-gray-600 text-lg">
          Explore our handpicked selection of available cars.
        </p>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableCars.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            No featured cars available.
          </p>
        )}

        {availableCars.map(car => (
          <div
            key={car.id}
            className="fc-card border border-gray-300 rounded-lg p-4 bg-white hover:shadow-lg transition"
          >
            {/* Image */}
            {car.cars_image && (
              <img
                src={`http://localhost:1000/${car.cars_image}`}
                alt={car.name}
                className="fc-img w-full h-48 object-cover rounded-md"
              />
            )}

            {/* Category */}
            {car.category_name && (
              <span className="inline-block mt-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                {car.category_name}
              </span>
            )}

            {/* Name */}
            <h3 className="text-xl font-semibold mt-2">
              {car.name}
            </h3>

            {/* Info */}
            <div className="flex gap-4 text-sm text-gray-600 mt-2">
              {car.fuel && (
                <span className="flex items-center gap-1">
                  <Fuel className="w-4 h-4" /> {car.fuel}
                </span>
              )}
              {car.rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" /> {car.rating}
                </span>
              )}
            </div>

            {/* Price & Button */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-lg font-bold text-red-600">
                ₹{car.price_per_day}/day
              </span>
              <button
                onClick={() => handleBook(car.id)}
                className="flex items-center gap-1 text-sm text-red-600 font-medium hover:underline"
              >
                Book Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate('/cars')}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-semibold transition"
        >
          View All Cars
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}

export default FeaturedCars
