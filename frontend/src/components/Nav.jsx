import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, Menu, X, LogIn } from 'lucide-react'

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-gray-800">
            <Car className="h-8 w-8" />
            <span className="text-xl font-bold">Car</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-red-500">Home</Link>
            <Link to="/cars" className="hover:text-red-500">Cars</Link>
            <Link to="/about" className="hover:text-red-500">About</Link>
            <Link to="/contact" className="hover:text-red-500">Contact</Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="flex items-center gap-2">
              <LogIn className="h-5 w-5" /> Login
            </Link>
            <Link to="/register" className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Register
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <Link to="/" className="block px-3 py-2 hover:text-red-500" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/cars" className="block px-3 py-2 hover:text-red-500" onClick={() => setIsMenuOpen(false)}>Cars</Link>
            <Link to="/about" className="block px-3 py-2 hover:text-red-500" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/contact" className="block px-3 py-2 hover:text-red-500" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <div>
                <Link to="/login" className="block px-3 py-2 hover:text-red-500" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => setIsMenuOpen(false)}>Register</Link>
                
          </div>

          </div>
        )}
      </div>
    </nav>
  )
}

export default Nav
