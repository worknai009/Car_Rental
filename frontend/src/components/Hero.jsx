import React, { useEffect, useState } from 'react'
import { MapPin, Calendar, Clock, Search } from 'lucide-react'
import ScrollReveal from 'scrollreveal'

const Hero = () => {
  // State to hold search values
  const [searchData, setSearchData] = useState({
    pickupLocation: '',
    dropLocation: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: ''
  });

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

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    console.log("Searching for cars with:", searchData);
    // Logic to filter cars or navigate to /cars page goes here
  };

  return (
    <section className="hero-section bg-gradient-to-br from-red-500 to-red-700 text-white py-20 px-5 text-center">

      {/* Heading */}
      <h1 className="head-section text-4xl sm:text-5xl font-bold mb-4">
        Find Your Perfect <span className="text-yellow-400">Rental Car</span>
      </h1>

      <p className="head-section text-lg sm:text-xl mb-12 text-gray-200">
        Discover amazing deals on quality vehicles. Book now and drive away with confidence.
      </p>

      {/* Search Box - Updated to grid-cols-5 for the new field */}
      <div className="hero-reveal bg-white text-gray-800 rounded-lg p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 shadow-lg">

        {/* Pickup Location */}
        <div className="reveal-y">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-5 h-5 text-red-600" />
            Pickup Location
          </label>
          <select
            name="pickupLocation"
            className="w-full p-2 border border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-red-500 outline-none"
            value={searchData.pickupLocation}
            onChange={handleChange}
          >
            <option value="" disabled>Select City</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>

        {/* Drop Location (NEW) */}
        <div className="reveal-y">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            Drop Location
          </label>
          <select
            name="dropLocation"
            className="w-full p-2 border border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-red-500 outline-none"
            value={searchData.dropLocation}
            onChange={handleChange}
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
            <Calendar className="w-5 h-5 text-red-600" />
            Pickup Date
          </label>
          <input 
            type="date" 
            name="pickupDate"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-red-500 outline-none" 
          />
        </div>

        {/* Return Date */}
        <div className="reveal-y">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            Return Date
          </label>
          <input 
            type="date" 
            name="returnDate"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-red-500 outline-none" 
          />
        </div>

        {/* Pickup Time */}
        <div className="reveal-y">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Clock className="w-5 h-5 text-red-600" />
            Pickup Time
          </label>
          <input 
            type="time" 
            name="pickupTime"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-red-500 outline-none" 
          />
        </div>

        {/* Search Button - Spans full width on mobile, moves to bottom or side on desktop */}
        <div className="reveal-y flex items-end md:col-span-3 lg:col-span-5 mt-2">
          <button 
            onClick={handleSearch}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-md"
          >
            <Search className="w-5 h-5" />
            Search Available Cars
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero