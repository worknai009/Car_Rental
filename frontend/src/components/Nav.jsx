import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  LogIn,
  Home,
  Package,
  Info,
  Mail,
  Bookmark,
  ChevronDown,
  
} from "lucide-react";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

  // Login dropdown
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const loginRef = useRef(null);

  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Cars", path: "/cars", icon: Package },
    { name: "My Bookings", path: "/my-bookings", icon: Bookmark },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
    {name: "Events" , path: "/events", icon:Mail}
  ];

  // ✅ Change paths if your app uses different routes
  const loginOptions = [
    { name: "User Login", path: "/login" },
    { name: "Admin Login", path: "/admin/login" },
    { name: "Car Register Login", path: "/car-register/login" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (loginRef.current && !loginRef.current.contains(e.target)) {
        setIsLoginOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close login dropdown if mobile menu opens
  useEffect(() => {
    if (isMenuOpen) setIsLoginOpen(false);
  }, [isMenuOpen]);

  return (
    <>
      {/* Main Navbar - Fully Transparent with Cyan/Teal Theme */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Section - Logo with Orbital Animation */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  {/* Orbital Ring - Cyan/Teal Theme */}
                  <div className="absolute inset-0 w-16 h-16 -left-4 -top-4">
                    <div className="absolute inset-0 border-2 border-cyan-200 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-2 border-2 border-teal-300 rounded-full animate-spin-reverse"></div>
                  </div>

                  {/* Logo Icon - Cyan/Teal Gradient */}
                  <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Car className="h-7 w-7 text-white" />
                  </div>
                </div>

                {/* Logo Text with White Colors */}
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none drop-shadow-lg">
                    CarHub
                  </span>
                  <span className="text-[10px] text-white/80 font-medium tracking-widest drop-shadow-md">
                    PREMIUM RIDES
                  </span>
                </div>
              </Link>
            </div>

            {/* Center Section - Floating Menu Pills (Desktop) */}
            <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-xl rounded-full p-2 shadow-lg border border-gray-200/50">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setActiveItem(item.name.toLowerCase())}
                      className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-500 group ${
                        activeItem === item.name.toLowerCase()
                          ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg scale-105"
                          : "text-gray-700 hover:bg-cyan-50 hover:text-cyan-600"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 transition-transform duration-300 ${
                          activeItem === item.name.toLowerCase()
                            ? ""
                            : "group-hover:scale-125"
                        }`}
                      />
                      <span className="text-sm whitespace-nowrap">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Section - Auth Buttons */}
            <div className="flex items-center gap-3">
              {/* ✅ Login Dropdown (Desktop) */}
              <div className="hidden md:block relative" ref={loginRef}>
                <button
                  type="button"
                  onClick={() => setIsLoginOpen((p) => !p)}
                  className="relative px-5 py-2.5 rounded-2xl bg-white/40 backdrop-blur-md border-2 border-gray-300/50 text-gray-700 font-semibold overflow-hidden group hover:border-cyan-400 transition-all duration-500 hover:shadow-xl flex items-center gap-2"
                >
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-cyan-600 transition-colors whitespace-nowrap">
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Login</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isLoginOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                </button>

                {isLoginOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-gray-200/60 overflow-hidden z-50">
                    <div className="p-2">
                      {loginOptions.map((opt) => (
                        <Link
                          key={opt.name}
                          to={opt.path}
                          onClick={() => setIsLoginOpen(false)}
                          className="flex items-center px-4 py-3 rounded-xl text-gray-700 font-semibold hover:bg-cyan-50 hover:text-cyan-700 transition-all"
                        >
                          {opt.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

             

              {/* Mobile Menu Button - Morphing Animation */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden relative w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-300 shadow-lg flex items-center justify-center"
              >
                <div className="relative w-6 h-6">
                  {/* Hamburger to X Animation */}
                  <span
                    className={`absolute left-0 top-1 w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                      isMenuOpen ? "top-3 rotate-45" : ""
                    }`}
                  ></span>
                  <span
                    className={`absolute left-0 top-3 w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                      isMenuOpen ? "opacity-0 scale-0" : ""
                    }`}
                  ></span>
                  <span
                    className={`absolute left-0 top-5 w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                      isMenuOpen ? "top-3 -rotate-45" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Sidebar Style with Cyan/Teal Theme */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-white/95 backdrop-blur-2xl shadow-2xl z-40 transform transition-transform duration-500 ease-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="p-8 pt-28">
          {/* Mobile Menu Items with Stagger */}
          <div className="space-y-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveItem(item.name.toLowerCase());
                  }}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold transition-all duration-500 transform ${
                    activeItem === item.name.toLowerCase()
                      ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg translate-x-2"
                      : "text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 hover:translate-x-2"
                  }`}
                  style={{
                    animation: isMenuOpen
                      ? `slideInRight 0.4s ease-out ${index * 0.1}s both`
                      : "none",
                    transformOrigin: "right",
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-lg">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* ✅ Mobile Login Options */}
          <div className="mt-8 space-y-3">
            {loginOptions.map((opt, i) => (
              <Link
                key={opt.name}
                to={opt.path}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:border-cyan-400 hover:text-cyan-600 transition-all duration-300"
                style={{
                  animation: isMenuOpen
                    ? `slideInRight 0.4s ease-out ${0.4 + i * 0.1}s both`
                    : "none",
                }}
              >
                <LogIn className="h-5 w-5" />
                {opt.name}
              </Link>
            ))}

            {/* Mobile Register */}
            <Link
              to="/register"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              style={{
                animation: isMenuOpen
                  ? `slideInRight 0.4s ease-out ${
                      0.4 + loginOptions.length * 0.1
                    }s both`
                  : "none",
              }}
            >
              Register
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </Link>
          </div>
        </div>

        {/* Decorative Elements - Cyan/Teal */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-500/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Overlay for Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-500"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }
      `}</style>
    </>
  );
};

export default Nav;
