import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Mail, Lock, Instagram, Car } from 'lucide-react';
import ScrollReveal from 'scrollreveal';

const Login = () => {
  const navigate = useNavigate();
  
  // State to handle form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Animation logic
  useEffect(() => {
    const sr = ScrollReveal();
    sr.reveal('.login-reveal', {
      origin: 'bottom',
      distance: '50px',
      duration: 1000,
      easing: 'ease-in-out',
      reset: false,
      interval: 100
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.type === 'email' ? 'email' : 'password']: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', formData);
    // 🔜 Here you will call your backend API: axios.post('http://localhost:5000/login', formData)
  };

  return (
    <div className='py-14 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-red-700'>
      
      {/* Logo Section */}
      <div className='text-center mb-6 login-reveal'>
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
        <form className='space-y-4' onSubmit={handleSubmit}>
          
          {/* Email Input */}
          <div className='relative'>
            <Mail className='absolute left-3 top-3 text-gray-400 w-5 h-5' />
            <input
              type='email'
              required
              value={formData.email}
              onChange={handleChange}
              placeholder='Email Address'
              className='w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
            />
          </div>

          {/* Password Input */}
          <div className='relative'>
            <Lock className='absolute left-3 top-3 text-gray-400 w-5 h-5' />
            <input
              type='password'
              required
              value={formData.password}
              onChange={handleChange}
              placeholder='Password'
              className='w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className='flex justify-between items-center text-sm text-gray-600'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input type='checkbox' className='h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded' />
              Remember Me
            </label>
            <span className='text-red-600 cursor-pointer hover:underline'>Forgot Password?</span>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition transform active:scale-95'
          >
            Sign In
          </button>
        </form>

        {/* Social Login Separator */}
        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social Login Icons */}
        <div className='flex justify-center gap-4'>
          <Facebook className='w-6 h-6 text-blue-600 hover:scale-110 transition cursor-pointer' />
          <Instagram className='w-6 h-6 text-pink-500 hover:scale-110 transition cursor-pointer' />
        </div>

        {/* Footer Link to Register */}
        <p className='text-center text-gray-500 mt-6 text-sm'>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className='text-red-600 font-bold hover:underline transition'
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;