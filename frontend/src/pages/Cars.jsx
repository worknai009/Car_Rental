import React, { useEffect } from 'react'
import ScrollReveal from 'scrollreveal'

import bmw from '../assets/bmw.jpg'
import audi from '../assets/audi.avif'
import kia from '../assets/kia.jfif'
import tesla from '../assets/tesla.jfif'
import toyota from '../assets/toyota.jfif'
import ford from '../assets/ford.jfif'

import {
  Car,
  MapPin,
  Users,
  Fuel,
  Star,
  ArrowRight,
} from 'lucide-react'

const cars = [
  {
    id: 1,
    name: 'BMW X5',
    year: 2023,
    location: 'Pune',
    seats: 5,
    fuel: 'Petrol',
    price: 5500,
    rating: 4.8,
    badge: 'Popular',
    image: bmw,
  },
  {
    id: 2,
    name: 'Audi A6',
    year: 2022,
    location: 'Mumbai',
    seats: 5,
    fuel: 'Diesel',
    price: 6000,
    rating: 4.7,
    badge: 'Premium',
    image: audi,
  },
  {
    id: 3,
    name: 'Kia Seltos',
    year: 2021,
    location: 'Pune',
    seats: 5,
    fuel: 'Petrol',
    price: 3200,
    rating: 4.5,
    badge: 'Best Value',
    image: kia,
  },
  {
    id: 4,
    name: 'Tesla Model 3',
    year: 2023,
    location: 'Bangalore',
    seats: 5,
    fuel: 'Electric',
    price: 7500,
    rating: 4.9,
    badge: 'Electric',
    image: tesla,
  },
  {
    id: 5,
    name: 'Toyota Fortuner',
    year: 2022,
    location: 'Delhi',
    seats: 7,
    fuel: 'Diesel',
    price: 6500,
    rating: 4.6,
    badge: 'Family',
    image: toyota,
  },
  {
    id: 6,
    name: 'Ford Endeavour',
    year: 2021,
    location: 'Mumbai',
    seats: 7,
    fuel: 'Diesel',
    price: 6200,
    rating: 4.6,
    badge: 'Adventure',
    image: ford,
  },
]

const FeaturedCars = () => {
  useEffect(() => {
    const sr = ScrollReveal({
      reset: false,
      distance: '60px',
      duration: 1200,
      easing: 'ease-in-out',
    })

    // Card animation (FIXED for first card)
    sr.reveal('.fc-card', {
      origin: 'bottom',
      interval: 200,
      viewFactor: 0.2, // 🔥 FIX
    })

    // Image animation
    sr.reveal('.fc-img', {
      scale: 0.85,
      interval: 200,
      delay: 100,
      viewFactor: 0.2,
    })
  }, [])

  return (
    <section className="my-20 px-5 max-w-6xl mx-auto flex flex-col gap-10">

      {/* Heading */}
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
          <Car className="w-8 h-8 text-red-600" />
          Featured Cars
        </h2>
        <p className="text-gray-600 text-lg">
          Explore our handpicked selection of top-rated cars for your next journey.
        </p>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car.id}
            className="fc-card border border-gray-300 rounded-lg p-4 bg-white hover:shadow-lg transition"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={car.image}
                alt={car.name}
                className="fc-img w-full h-48 object-cover rounded-md"
              />
              <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                {car.badge}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mt-3 text-gray-600 text-sm">
              <MapPin className="w-4 h-4" />
              {car.location}
            </div>

            {/* Name */}
            <h3 className="text-xl font-semibold mt-2">
              {car.name} ({car.year})
            </h3>

            {/* Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {car.seats}
              </span>
              <span className="flex items-center gap-1">
                <Fuel className="w-4 h-4" /> {car.fuel}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" /> {car.rating}
              </span>
            </div>

            {/* Price & Button */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-lg font-bold text-red-600">
                ₹{car.price}/day
              </span>
              <button className="flex items-center gap-1 text-sm text-red-600 font-medium hover:underline">
                Book Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-semibold transition">
          View All Cars
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}

export default FeaturedCars
