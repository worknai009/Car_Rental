import React, { useEffect } from "react";
import ScrollReveal from "scrollreveal";
import {
  Car,
  Users,
  MapPin,
  Star,
  Award,
  Shield,
  Clock,
  Heart,
  Target,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Quote,
} from "lucide-react";

const About = () => {
  useEffect(() => {
    const sr = ScrollReveal({
      reset: false,
      distance: "60px",
      duration: 1200,
      easing: "ease-in-out",
    });
    sr.reveal(".page-header", { origin: "top", distance: "30px" });
    sr.reveal(".hero-section", { origin: "left", delay: 100 });
    sr.reveal(".about-card", {
      origin: "bottom",
      interval: 150,
      viewFactor: 0.2,
    });
    sr.reveal(".stats-card", {
      origin: "bottom",
      interval: 100,
      viewFactor: 0.2,
    });
    sr.reveal(".mission-section", { origin: "bottom", delay: 200 });
    sr.reveal(".timeline-item", {
      origin: "left",
      interval: 200,
      viewFactor: 0.2,
    });
    sr.reveal(".value-card", {
      origin: "bottom",
      interval: 150,
      viewFactor: 0.2,
    });
  }, []);

  const features = [
    {
      icon: Car,
      title: "Wide Car Selection",
      description:
        "Choose from luxury, family, electric, and budget-friendly vehicles",
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      icon: Users,
      title: "Trusted by Users",
      description: "Thousands of happy customers across multiple cities",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      icon: MapPin,
      title: "Multiple Locations",
      description: "Available in Pune, Mumbai, Delhi, Bangalore & more",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Star,
      title: "Top Rated Service",
      description: "High ratings for quality, safety, and customer support",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Shield,
      title: "Fully Insured",
      description: "Complete insurance coverage for peace of mind",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance whenever you need",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  const stats = [
    { number: "500+", label: "Premium Cars", icon: Car },
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "15+", label: "Cities Covered", icon: MapPin },
    { number: "4.9★", label: "Average Rating", icon: Star },
  ];

  const timeline = [
    {
      year: "2018",
      title: "Company Founded",
      description:
        "Started with a vision to revolutionize car rentals in India",
    },
    {
      year: "2019",
      title: "Expanded to 5 Cities",
      description: "Grew our presence across major metropolitan areas",
    },
    {
      year: "2021",
      title: "Reached 10,000 Bookings",
      description: "Milestone achievement with growing customer base",
    },
    {
      year: "2023",
      title: "Award Winning Service",
      description: "Recognized as Best Car Rental Platform",
    },
    {
      year: "2024",
      title: "Going Electric",
      description: "Launched electric vehicle fleet for sustainable travel",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Customer First",
      description: "Your satisfaction is our top priority",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Ensuring secure and safe experiences",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Constantly improving our services",
    },
    {
      icon: Heart,
      title: "Sustainability",
      description: "Committed to eco-friendly practices",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-30 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="page-header text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 px-4 py-2 rounded-full font-semibold text-sm border border-cyan-200">
            <Sparkles className="w-5 h-5" />
            <span>About CarHub</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">
            Redefining Car Rentals <br />
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              One Journey at a Time
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for comfortable, affordable, and reliable car
            rentals. Experience the difference with premium vehicles and
            exceptional service.
          </p>
        </div>

        <div className="hero-section mb-20">
          <div className="bg-gradient-to-br from-cyan-600 via-teal-600 to-cyan-700 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <Quote className="w-12 h-12 text-white/50 mb-6" />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                We are a modern car rental platform designed to make your travel
                simple and hassle-free.
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-4xl">
                Whether you're planning a family trip, business travel, or a
                weekend getaway, we provide a wide range of well-maintained cars
                at the best prices. Our commitment to quality and customer
                satisfaction sets us apart.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold border border-white/30">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Transparent Pricing</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold border border-white/30">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>No Hidden Fees</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold border border-white/30">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="stats-card bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-center border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                CarHub
              </span>
              ?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We provide exceptional service with features designed for your
              convenience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="about-card group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-teal-600 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mission-section mb-20">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Our mission is to redefine car rentals by providing transparent
                pricing, seamless booking, and excellent customer experience —
                every single time. We believe in making travel accessible,
                affordable, and enjoyable for everyone.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <Award className="w-8 h-8 text-yellow-400 mb-3" />
                  <h4 className="text-lg font-bold text-white mb-2">
                    Excellence
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Committed to delivering the highest quality service
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <Heart className="w-8 h-8 text-pink-400 mb-3" />
                  <h4 className="text-lg font-bold text-white mb-2">Care</h4>
                  <p className="text-gray-300 text-sm">
                    Putting customer satisfaction at the heart of everything
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-gray-600 text-lg">
              Growing and evolving to serve you better
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-teal-500 hidden md:block"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`timeline-item flex flex-col md:flex-row items-start md:items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-1 ${
                      index % 2 === 0 ? "md:text-right" : ""
                    }`}
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className="text-2xl font-black text-cyan-600 mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex-shrink-0 shadow-lg flex items-center justify-center relative z-10">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Our Core{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="text-gray-600 text-lg">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="value-card bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-center border border-gray-100 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 rounded-3xl p-8 md:p-12 shadow-2xl text-center text-white">
          <h3 className="text-3xl md:text-4xl font-black mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and experience the best car
            rental service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-cyan-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              Browse Cars
              <Car className="w-5 h-5" />
            </button>
            <button className="bg-black/20 backdrop-blur-sm border-2 border-white/30 px-8 py-4 rounded-xl font-bold hover:bg-black/30 transition-all transform hover:scale-105">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
