import React, { useEffect, useState } from "react";
import ScrollReveal from "scrollreveal";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Car,
  Send,
  ArrowRight,
  Clock,
  Shield,
  Award,
  ChevronRight,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const sr = ScrollReveal({
      reset: false,
      distance: "50px",
      duration: 1200,
      easing: "ease-in-out",
    });

    sr.reveal(".footer-cta", { origin: "top", distance: "30px" });
    sr.reveal(".footer-col-1", { origin: "left", delay: 100 });
    sr.reveal(".footer-col-2", { origin: "bottom", delay: 200 });
    sr.reveal(".footer-col-3", { origin: "bottom", delay: 300 });
    sr.reveal(".footer-col-4", { origin: "right", delay: 400 });
    sr.reveal(".footer-bottom", { origin: "bottom", delay: 500 });
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Our Fleet", path: "/cars" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  const services = [
    { name: "Airport Transfer", path: "/airport" },
    { name: "Corporate Rental", path: "/corporate" },
    { name: "Long Term Rental", path: "/long-term" },
    { name: "Wedding Cars", path: "/wedding" },
    { name: "Chauffeur Service", path: "/chauffeur" },
  ];

  const socialLinks = [
    { icon: Facebook, name: "Facebook", url: "#", color: "hover:bg-blue-600" },
    {
      icon: Instagram,
      name: "Instagram",
      url: "#",
      color: "hover:bg-pink-600",
    },
    { icon: Twitter, name: "Twitter", url: "#", color: "hover:bg-sky-500" },
    { icon: Linkedin, name: "LinkedIn", url: "#", color: "hover:bg-blue-700" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200 mt-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>

      {/* Newsletter CTA Section */}
      <div className="footer-cta relative border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
                  Get Exclusive Offers!
                </h3>
                <p className="text-white/90 text-lg">
                  Subscribe to our newsletter and get 10% off your first booking
                </p>
              </div>

              {/* Newsletter Form */}
              <form onSubmit={handleSubscribe} className="w-full md:w-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full sm:w-80 pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="group bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {subscribed ? (
                      <>
                        <span>Subscribed!</span>
                        <Award className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <Send className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="footer-col-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Car className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                CarHub
              </h3>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for premium car rentals. We provide
              exceptional service with a wide selection of vehicles.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <a
                href="#"
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-500 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-sm">Pune, Maharashtra, India</span>
              </a>

              <a
                href="tel:+919999999999"
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-500 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-sm">+91 9999 999 999</span>
              </a>

              <a
                href="mailto:support@carhub.com"
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-500 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-sm">support@carhub.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col-2">
            <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-500 transition-all duration-300 group"
                  >
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col-3">
            <h4 className="text-xl font-bold mb-6 text-white">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyan-500 transition-all duration-300 group"
                  >
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    <span>{service.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours & Social */}
          <div className="footer-col-4">
            <h4 className="text-xl font-bold mb-6 text-white">Working Hours</h4>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-gray-400">
                <Clock className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="font-semibold text-white text-sm">Mon - Sat</p>
                  <p className="text-sm">9:00 AM - 8:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Clock className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="font-semibold text-white text-sm">Sunday</p>
                  <p className="text-sm">10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-4 text-white">Follow Us</h5>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      aria-label={social.name}
                      className={`w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${social.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-gray-700">
          <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">100% Secure</p>
              <p className="text-gray-400 text-xs">Safe & Protected</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Award Winning</p>
              <p className="text-gray-400 text-xs">Top Rated Service</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">24/7 Support</p>
              <p className="text-gray-400 text-xs">Always Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom relative border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-white font-semibold">CarHub</span>. All
              rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-cyan-500 transition-colors"
              >
                Privacy Policy
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="#"
                className="text-gray-400 hover:text-cyan-500 transition-colors"
              >
                Terms of Service
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="#"
                className="text-gray-400 hover:text-cyan-500 transition-colors"
              >
                Cookie Policy
              </a>
            </div>

            {/* Made with love */}
            <div className="text-gray-400 text-sm flex items-center gap-2">
              Made with <span className="text-cyan-500 animate-pulse">❤️</span>{" "}
              in India
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
