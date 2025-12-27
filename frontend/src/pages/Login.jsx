import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Mail, Lock, Instagram, Car } from 'lucide-react';
import ScrollReveal from 'scrollreveal';
<<<<<<< HEAD
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = login, 2 = otp
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
=======

const Login = () => {
  const navigate = useNavigate();
  
  // State to handle form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
>>>>>>> 754ef080418092c9191f314cce22e96806e363cc
  });

  // Animation logic
  useEffect(() => {
    const sr = ScrollReveal();
    sr.reveal('.login-reveal', {
      origin: 'bottom',
      distance: '50px',
      duration: 1000,
      interval: 100
    });
  }, []);

  const handleChange = (e) => {
<<<<<<< HEAD
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔐 LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:1000/login', {
        email: formData.email,
        password: formData.password
      });

      alert(res.data.message);
      setUserId(res.data.user_id);
      setStep(2); // show OTP

    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  // 🔐 VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:1000/verify-otp', {
        user_id: userId,
        otp: formData.otp
      });

      alert(res.data.message);

      localStorage.setItem('token', res.data.token);
      navigate('/');

    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP');
    }
=======
    setFormData({ ...formData, [e.target.type === 'email' ? 'email' : 'password']: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', formData);
    // 🔜 Here you will call your backend API: axios.post('http://localhost:5000/login', formData)
>>>>>>> 754ef080418092c9191f314cce22e96806e363cc
  };

  return (
    <div className='py-14 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-red-700'>
<<<<<<< HEAD

      {/* Logo */}
=======
      
      {/* Logo Section */}
>>>>>>> 754ef080418092c9191f314cce22e96806e363cc
      <div className='text-center mb-6 login-reveal'>
        <div className='text-white text-3xl font-bold flex justify-center items-center gap-2'>
          <Car className='w-10 h-10' /> <span>AutoRent</span>
        </div>
      </div>

      {/* Form Container */}
      <div className='w-full max-w-md bg-gray-100 rounded-lg shadow-lg p-8 login-reveal'>

        <h2 className='text-2xl font-bold text-center text-gray-800 mb-1'>
          {step === 1 ? 'Welcome Back' : 'Verify OTP'}
        </h2>
        <p className='text-center text-gray-500 mb-6'>
          {step === 1 ? 'Sign in to your account' : 'Enter OTP sent to your email'}
        </p>

<<<<<<< HEAD
        {/* LOGIN FORM */}
        {step === 1 && (
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div className='relative'>
              <Mail className='absolute left-3 top-3 text-gray-400 w-5 h-5' />
              <input
                type='email'
                name='email'
                required
                onChange={handleChange}
                placeholder='Email Address'
                className='w-full pl-10 pr-4 py-2 bg-white border rounded-md'
              />
            </div>

            <div className='relative'>
              <Lock className='absolute left-3 top-3 text-gray-400 w-5 h-5' />
              <input
                type='password'
                name='password'
                required
                onChange={handleChange}
                placeholder='Password'
                className='w-full pl-10 pr-4 py-2 bg-white border rounded-md'
              />
            </div>

            <button className='w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold'>
              Sign In
            </button>
          </form>
        )}

        {/* OTP FORM (NO DESIGN CHANGE) */}
        {step === 2 && (
          <form className='space-y-4' onSubmit={handleVerifyOtp}>
            <input
              type='text'
              name='otp'
              required
              onChange={handleChange}
              placeholder='Enter 6-digit OTP'
              className='w-full px-4 py-2 bg-white border rounded-md focus:ring-2 focus:ring-green-500'
=======
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
>>>>>>> 754ef080418092c9191f314cce22e96806e363cc
            />

<<<<<<< HEAD
            <button className='w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold'>
              Verify OTP
            </button>
          </form>
        )}

        <p className='text-center text-gray-500 mt-6 text-sm'>
          Don't have an account?{' '}
          <Link to='/register' className='text-red-600 font-bold hover:underline'>
=======
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
>>>>>>> 754ef080418092c9191f314cce22e96806e363cc
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> 754ef080418092c9191f314cce22e96806e363cc
