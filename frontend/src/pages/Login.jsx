import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import {
  Facebook,
  Mail,
  Lock,
  Instagram,
  Car,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Shield,
  Clock,
  Award,
  Chrome,
  X,
  KeyRound,
} from "lucide-react";

const Login = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    // ScrollReveal would be initialized here
  }, []);

  useEffect(() => {
    if (showOtpModal && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showOtpModal, resendTimer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // store user_id for OTP verification
      setFormData(prev => ({ ...prev, user_id: data.user_id }));

      setShowOtpModal(true);
      setResendTimer(60);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };



  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;

    setOtpLoading(true);

    try {
      const user_id = formData.user_id;      // Standardized API call
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,    // 👈 required
          otp: otpValue
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      // OTP Verified

      // redirect to home page or dashboard
      setShowOtpModal(false);
      localStorage.setItem("token", data.token);
      navigate(redirectTo, { replace: true });

    } catch (err) {
      alert(err.message); // shows proper backend error
    } finally {
      setOtpLoading(false);
    }
  };



  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    console.log("OTP Verified");
  };

  const features = [
    { icon: CheckCircle2, text: "Instant Booking" },
    { icon: Shield, text: "Secure Payment" },
    { icon: Clock, text: "24/7 Support" },
    { icon: Award, text: "Best Prices" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Brand & Info */}
          <div className="login-left relative bg-gradient-to-br from-cyan-600 via-teal-600 to-cyan-700 p-8 lg:p-10 flex flex-col justify-between text-white overflow-hidden min-h-[500px] lg:min-h-[600px]">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            {/* Logo & Brand */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-white/30">
                  <Car className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-black">CarHub</h1>
                  <p className="text-white/80 text-xs">Premium Car Rentals</p>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-black leading-tight">
                  Welcome Back to CarHub
                </h2>
                <p className="text-base text-white/90">
                  Sign in to access your account and continue your journey
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5 mb-2" />
                    <p className="text-xs font-semibold">{feature.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="relative z-10 mt-6 flex items-center gap-6 border-t border-white/20 pt-4">
              <div>
                <div className="text-2xl font-black">500+</div>
                <div className="text-white/80 text-xs">Cars</div>
              </div>
              <div>
                <div className="text-2xl font-black">50K+</div>
                <div className="text-white/80 text-xs">Users</div>
              </div>
              <div>
                <div className="text-2xl font-black">4.9★</div>
                <div className="text-white/80 text-xs">Rating</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="login-form p-8 lg:p-10 flex flex-col justify-center">
            {/* Form Header */}
            <div className="mb-5">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                Sign In
              </h2>
              <p className="text-gray-600 text-sm">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Email Input */}
              <div className="form-element">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-element">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-element flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium group-hover:text-gray-900">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-cyan-600 font-semibold hover:text-cyan-700 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="form-element w-full group relative bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              </button>

              {/* Sign Up Link */}
              <p className="form-element text-center text-gray-600 mt-4 text-sm">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-cyan-600 font-bold hover:text-cyan-700 hover:underline"
                >
                  Create Account
                </a>
              </p>

              {/* Terms */}
              <p className="form-element text-center text-xs text-gray-500 mt-3">
                By signing in, you agree to our{" "}
                <a href="#" className="text-gray-700 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-gray-700 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-6 relative">
              <button
                onClick={() => setShowOtpModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Verify OTP</h3>
                  <p className="text-white/80 text-sm">
                    Enter the code sent to your email
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Email Display */}
              <div className="bg-cyan-50 border-2 border-cyan-100 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">OTP sent to</p>
                <p className="font-bold text-gray-900">
                  {formData.email || "your email"}
                </p>
              </div>

              {/* OTP Input */}
              <form onSubmit={handleOtpSubmit}>
                <div className="flex gap-2 justify-center mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-black border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                    />
                  ))}
                </div>

                {/* Resend OTP */}
                <div className="text-center mb-6">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-600">
                      Resend OTP in{" "}
                      <span className="font-bold text-cyan-600">
                        {resendTimer}s
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-sm font-bold text-cyan-600 hover:text-cyan-700 hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={otpLoading || otp.join("").length !== 6}
                  className="w-full group relative bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {otpLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Verify & Continue</span>
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                </button>
              </form>

              {/* Security Note */}
              <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                <Shield className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  For your security, this OTP will expire in 5 minutes. Never
                  share this code with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
