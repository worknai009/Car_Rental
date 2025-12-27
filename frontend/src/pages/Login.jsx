import React, { useEffect } from 'react'
import { Facebook, Mail, Lock, Instagram, Car } from 'lucide-react'
import ScrollReveal from 'scrollreveal'

const Login = () => {

  useEffect(() => {
    ScrollReveal().reveal('.login-reveal', {
      origin: 'bottom',
      distance: '50px',
      duration: 1000,
      easing: 'ease-in-out',
      reset: false,
      interval: 100
    })
  }, [])

  return (
    <div className='py-14 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-red-700 login-reveal'>

      {/* Logo */}
      <div className='text-center mb-6'>
        <div className='text-white text-3xl font-bold flex justify-center items-center gap-2'>
          <Car className='w-10 h-10' /> <span>AutoRent</span>
        </div>
      </div>

      {/* Form Container */}
      <div className='w-full max-w-md bg-gray-100 rounded-lg shadow-lg p-8 login-reveal'>

        {/* Heading */}
        <h2 className='text-2xl font-bold text-center text-gray-800 mb-1'>Welcome Back</h2>
        <p className='text-center text-gray-500 mb-6'>Sign in to your account</p>

        {/* Form */}
        <form className='space-y-4'>
          {/* Email */}
          <div className='relative'>
            <Mail className='absolute left-3 top-3 text-gray-400 w-5 h-5' />
            <input
              type='email'
              placeholder='Email Address'
              className='w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
            />
          </div>

          {/* Password */}
          <div className='relative'>
            <Lock className='absolute left-3 top-3 text-gray-400 w-5 h-5' />
            <input
              type='password'
              placeholder='Password'
              className='w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className='flex justify-between items-center text-sm text-gray-600'>
            <label className='flex items-center gap-2'>
              <input type='checkbox' className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded' />
              Remember Me
            </label>
            <span className='text-red-600 cursor-pointer hover:underline'>Forgot Password?</span>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition'
          >
            Sign In
          </button>
        </form>

        {/* Social Login */}
        <div className='mt-6 flex justify-center gap-4'>
          <Facebook className='w-6 h-6 text-blue-600 hover:scale-110 transition cursor-pointer' />
          <Instagram className='w-6 h-6 text-pink-500 hover:scale-110 transition cursor-pointer' />
        </div>

        {/* Footer */}
        <p className='text-center text-gray-500 mt-4 text-sm'>
          Don't have an account? <span className='text-red-600 cursor-pointer hover:underline'>Sign Up</span>
        </p>
      </div>
    </div>
  )
}

export default Login
