import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Car } from 'lucide-react'
import axios from 'axios'




const Register = () => {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

 const handleSubmit = async (e) => {
  e.preventDefault()

 

  try {
    const res = await axios.post(
      'http://localhost:1000/register',
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }
    )

    alert(res.data.message)
     navigate('/login')
  } catch (error) {
    alert(error.response?.data?.message || 'Registration failed')
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700 px-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="flex justify-center items-center gap-2 mb-6 text-red-600">
          <Car className="w-8 h-8" />
          <h2 className="text-2xl font-bold">AutoRent</h2>
        </div>

        <h3 className="text-xl font-semibold text-center mb-1">Create Account</h3>
        <p className="text-gray-500 text-center mb-6">
          Sign up to start booking cars
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                onChange={handleChange}
                className="w-full pl-10 py-2 border rounded focus:ring-2 focus:ring-red-500"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="w-full pl-10 py-2 border rounded focus:ring-2 focus:ring-red-500"
                placeholder="example@mail.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
                className="w-full pl-10 py-2 border rounded focus:ring-2 focus:ring-red-500"
                placeholder="********"
              />
            </div>
          </div>

        

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition"
          >
            Register
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 font-medium hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register
