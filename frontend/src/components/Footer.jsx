import React, { useEffect } from 'react'
import ScrollReveal from 'scrollreveal'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from 'lucide-react'

const Footer = () => {
  useEffect(() => {
    const sr = ScrollReveal({
      reset: false,
      distance: '50px',
      duration: 1200,
      easing: 'ease-in-out',
    })

    sr.reveal('.footer-col-1', { origin: 'left' })
    sr.reveal('.footer-col-2', { origin: 'bottom', delay: 150 })
    sr.reveal('.footer-col-3', { origin: 'right', delay: 300 })
    sr.reveal('.footer-bottom', { origin: 'bottom', delay: 400 })
  }, [])

  return (
    <footer className="bg-gray-900 text-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Company Info */}
        <div className="footer-col-1">
          <h3 className="text-2xl font-bold text-red-600 mb-4">
            CarRental
          </h3>
          <p className="text-gray-400 mb-4">
            Providing the best car rental services with a wide selection of
            vehicles and top-notch customer support.
          </p>

          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <span>Pune, Maharashtra, India</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-5 h-5 text-red-600" />
            <span>+91 9999999999</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-red-600" />
            <span>support@carrental.com</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col-2">
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="hover:text-red-600 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-red-600 transition"
              >
                About Us
              </Link>
            </li>
         
            <li>
              <Link
                to="/cars"
                className="hover:text-red-600 transition"
              >
                Cars
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-red-600 transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="footer-col-3">
          <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <Facebook className="w-6 h-6 hover:text-red-600 cursor-pointer transition" />
            <Instagram className="w-6 h-6 hover:text-red-600 cursor-pointer transition" />
            <Twitter className="w-6 h-6 hover:text-red-600 cursor-pointer transition" />
            <Linkedin className="w-6 h-6 hover:text-red-600 cursor-pointer transition" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom bg-gray-800 text-gray-400 text-center py-4 mt-8">
        &copy; {new Date().getFullYear()} CarRental. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
