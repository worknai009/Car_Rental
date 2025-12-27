import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Mail, Lock, Instagram, Car } from 'lucide-react';
import ScrollReveal from 'scrollreveal';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = login, 2 = otp
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  });

  useEffect(() => {
    ScrollReveal().reveal('.login-reveal', {
      origin: 'bottom',
      distance: '50px',
      duration: 1000,
      interval: 100
    });
  }, []);

  const handleChange = (e) => {
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
  };

  return (
    <div className='py-14 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-red-700'>

      {/* Logo */}
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
            />

            <button className='w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold'>
              Verify OTP
            </button>
          </form>
        )}

        <p className='text-center text-gray-500 mt-6 text-sm'>
          Don't have an account?{' '}
          <Link to='/register' className='text-red-600 font-bold hover:underline'>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
