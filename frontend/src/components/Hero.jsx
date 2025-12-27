import React, { useEffect } from 'react'
import { MapPin, Calendar, Clock, Search } from 'lucide-react'
import ScrollReveal from 'scrollreveal'

const Hero = () => {
  useEffect(() => {
    const sr = ScrollReveal({
      reset: false,
      easing: 'ease-in-out',
    })

    // Heading animation
    sr.reveal('.head-section', {
      scale: 0.9,
      duration: 1500,
    })

    // Left slide animation
    sr.reveal('.hero-reveal', {
      origin: 'left',
      distance: '50px',
      duration: 1000,
    })

    // Bottom stagger animation
    sr.reveal('.reveal-y', {
      origin: 'bottom',
      distance: '100px',
      duration: 1500,
      interval: 200,
    })
  }, [])

  return (
    <section className="hero-section bg-gradient-to-br from-red-500 to-red-700 text-white py-20 px-5 text-center">

      {/* Heading */}
      <h1 className="head-section text-4xl sm:text-5xl font-bold mb-4">
        Find Your Perfect <span className="text-yellow-400">Rental Car</span>
      </h1>

      <p className="head-section text-lg sm:text-xl mb-12 text-gray-200">
        Discover amazing deals on quality vehicles. Book now and drive away with confidence.
      </p>

      {/* Search Box */}
      <div className="hero-reveal bg-white text-gray-800 rounded-lg p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 shadow-lg">

        {/* Pickup Location */}
        <div className="reveal-y">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-5 h-5" />
            Pickup Location
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Select City</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>

        {/* Pickup Date */}
        <div className="reveal-y">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-5 h-5" />
            Pickup Date
          </label>
          <input type="date" className="w-full p-2 border border-gray-300 rounded cursor-pointer" />
        </div>

        {/* Pickup Time */}
        <div className="reveal-y">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Clock className="w-5 h-5" />
            Pickup Time
          </label>
          <input type="time" className="w-full p-2 border border-gray-300 rounded cursor-pointer" />
        </div>

        {/* Return Date */}
        <div className="reveal-y">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-5 h-5" />
            Return Date
          </label>
          <input type="date" className="w-full p-2 border border-gray-300 rounded cursor-pointer" />
        </div>

        {/* Search Button */}
        <div className="reveal-y flex items-end md:col-span-4">
          <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition">
            <Search className="w-5 h-5" />
            Search Cars
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
