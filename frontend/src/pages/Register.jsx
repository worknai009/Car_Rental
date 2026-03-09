import { useNavigate } from "react-router-dom";


import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Car,
  Eye,
  Phone,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Shield,
  Sparkles,
  Award,
  Star,
  Zap,
  Check,
  UserPlus,
  KeyRound,
  CircleCheck,
} from "lucide-react";
import ScrollReveal from "scrollreveal";

const Register = () => {

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);


  const passwordStrength = useMemo(() => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  }, [formData.password]);

  const currentStep = useMemo(() => {
    if (formData.password) return 3;
    if (formData.name && formData.email) return 2;
    return 1;
  }, [formData.name, formData.email, formData.password]);


  useEffect(() => {
    const sr = ScrollReveal({
      reset: false,
      distance: "60px",
      duration: 1200,
      easing: "ease-in-out",
    });
    sr.reveal(".register-header", { origin: "top", distance: "30px" });
    sr.reveal(".register-card", { origin: "bottom", delay: 200 });
    sr.reveal(".benefit-card", {
      origin: "left",
      interval: 150,
      viewFactor: 0.2,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.agreeTerms) {
      setError("Please accept Terms & Conditions");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };




  const benefits = [
    {
      icon: Zap,
      title: "Instant Access",
      description: "Book cars in seconds",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Your data is protected",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Guaranteed lowest rates",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: Star,
      title: "Top Rated",
      description: "4.9★ customer rating",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const steps = [
    { number: 1, title: "Personal Info", icon: UserPlus },
    { number: 2, title: "Set Password", icon: KeyRound },
    { number: 3, title: "Finish", icon: CircleCheck },
  ];

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200";
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50/30 to-teal-50/30 py-8 px-4 pt-30 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="register-header text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                CarHub
              </h1>
              <p className="text-xs text-gray-600">Premium Car Rentals</p>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600 text-lg">
            Join thousands of happy customers and start your journey today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-cyan-500" />
                <h3 className="text-lg font-black text-gray-900">
                  Why Join CarHub?
                </h3>
              </div>
              <div className="space-y-3">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={index}
                      className="benefit-card group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100 hover:border-cyan-200 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm mb-0.5">
                            {benefit.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl">
              <h4 className="font-black text-lg mb-4">Trusted by Thousands</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <span className="text-sm font-semibold">Active Users</span>
                  <span className="text-lg font-black">50K+</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <span className="text-sm font-semibold">Premium Cars</span>
                  <span className="text-lg font-black">500+</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <span className="text-sm font-semibold">Rating</span>
                  <span className="text-lg font-black">4.9★</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="register-card bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep >= step.number;
                    const isCompleted = currentStep > step.number;
                    return (
                      <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                              ? "bg-green-500 text-white shadow-lg"
                              : isActive
                                ? "bg-gradient-to-br from-cyan-600 to-teal-600 text-white shadow-lg scale-110"
                                : "bg-gray-200 text-gray-500"
                              }`}
                          >
                            {isCompleted ? (
                              <Check className="w-6 h-6" />
                            ) : (
                              <StepIcon className="w-6 h-6" />
                            )}
                          </div>
                          <div className="text-center">
                            <p
                              className={`text-xs font-bold ${isActive ? "text-gray-900" : "text-gray-500"
                                }`}
                            >
                              {step.title}
                            </p>
                          </div>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${currentStep > step.number
                              ? "bg-green-500"
                              : "bg-gray-200"
                              }`}
                          ></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-6">
                  <div
                    className={`space-y-4 transition-all duration-500 ${currentStep >= 1 ? "opacity-100" : "opacity-50"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-cyan-600" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900">
                        Personal Information
                      </h3>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-3.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full pl-12 pr-4 py-3.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="9876543210"
                          className="w-full pl-12 pr-4 py-3.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                          required
                          pattern="[0-9]{10,15}"
                        />
                      </div>
                    </div>

                  </div>

                  {currentStep >= 2 && (
                    <div className="border-t border-gray-200 my-6"></div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <KeyRound className="w-5 h-5 text-teal-600" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900">
                        Set Your Password
                      </h3>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a strong password"
                          className="w-full pl-12 pr-12 py-3.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
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
                      {formData.password && (
                        <div className="mt-3">
                          <div className="flex gap-2 mb-2">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={`h-2 flex-1 rounded-full transition-all ${level <= passwordStrength
                                  ? getStrengthColor()
                                  : "bg-gray-200"
                                  }`}
                              ></div>
                            ))}
                          </div>
                          {getStrengthText() && (
                            <p className="text-xs font-semibold text-gray-600">
                              Password strength:{" "}
                              <span
                                className={
                                  passwordStrength >= 3
                                    ? "text-green-600"
                                    : passwordStrength >= 2
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }
                              >
                                {getStrengthText()}
                              </span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                  </div>

                  {currentStep >= 3 && (
                    <div className="border-t border-gray-200 my-6"></div>
                  )}

                  <div
                    className={`space-y-4 transition-all duration-500 ${currentStep >= 3
                      ? "opacity-100"
                      : "opacity-50 pointer-events-none"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CircleCheck className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900">
                        Almost Done!
                      </h3>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          className="w-5 h-5 mt-0.5 text-cyan-600 border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                          required
                          disabled={currentStep < 3}
                        />
                        <span className="text-sm text-gray-700 leading-relaxed">
                          I agree to CarHub's{" "}
                          <a
                            href="#"
                            className="text-cyan-600 font-bold hover:underline"
                          >
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a
                            href="#"
                            className="text-cyan-600 font-bold hover:underline"
                          >
                            Privacy Policy
                          </a>
                          . I understand that my data will be processed
                          securely.
                        </span>
                      </label>
                    </div>
                    <button
                      type="submit"

                      className="w-full group relative bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold py-4 text-base rounded-xl transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-1 "
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating Your Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Create My Account</span>
                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    </button>
                  </div>
                </div>
              </form>

              <div className="bg-gray-50 px-8 py-5 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-cyan-600 font-bold hover:text-cyan-700 hover:underline"
                  >
                    Sign In Instead
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;