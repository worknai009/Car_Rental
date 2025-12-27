import React, { useEffect } from 'react'
import ScrollReveal from 'scrollreveal'
import { Car, Users, MapPin, Star } from 'lucide-react'

const About = () => {
  useEffect(() => {
    ScrollReveal().reveal('.about-card', {
      distance: '50px',
      origin: 'bottom',
      duration: 1000,
      interval: 200,
      easing: 'ease-in-out',
    })
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-5 my-20 flex flex-col gap-16">

      {/* Heading */}
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
          <Car className="w-8 h-8 text-red-600" />
          About Us
        </h1>
        <p className="text-gray-600 text-lg">
          Your trusted partner for comfortable, affordable, and reliable car rentals.
        </p>
      </div>

      {/* Description */}
      <div className="text-center max-w-3xl mx-auto text-gray-700 leading-relaxed">
        <p>
          We are a modern car rental platform designed to make your travel simple and
          hassle-free. Whether you're planning a family trip, business travel, or a
          weekend getaway, we provide a wide range of well-maintained cars at the best prices.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="about-card border rounded-lg p-6 text-center hover:shadow-lg transition">
          <Car className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Wide Car Selection</h3>
          <p className="text-gray-600 text-sm mt-2">
            Choose from luxury, family, electric, and budget-friendly cars.
          </p>
        </div>

        <div className="about-card border rounded-lg p-6 text-center hover:shadow-lg transition">
          <Users className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Trusted by Users</h3>
          <p className="text-gray-600 text-sm mt-2">
            Thousands of happy customers across multiple cities.
          </p>
        </div>

        <div className="about-card border rounded-lg p-6 text-center hover:shadow-lg transition">
          <MapPin className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Multiple Locations</h3>
          <p className="text-gray-600 text-sm mt-2">
            Available in Pune, Mumbai, Delhi, Bangalore & more.
          </p>
        </div>

        <div className="about-card border rounded-lg p-6 text-center hover:shadow-lg transition">
          <Star className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Top Rated Service</h3>
          <p className="text-gray-600 text-sm mt-2">
            High ratings for quality, safety, and customer support.
          </p>
        </div>

      </div>

      {/* Mission */}
      <div className="bg-red-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Our mission is to redefine car rentals by providing transparent pricing,
          seamless booking, and excellent customer experience — every single time.
        </p>
      </div>

    </section>
  )
}

export default About
