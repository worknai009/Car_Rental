import React, { useEffect, useState } from "react";
import ScrollReveal from "scrollreveal";
import videoImg from "../assets/video-img.jfif";
import { Play, X, Volume2, Maximize2, Award, Users, Car } from "lucide-react";

const VideoSection = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const sr = ScrollReveal({
      reset: false,
      distance: "60px",
      duration: 1200,
      easing: "ease-in-out",
    });

    sr.reveal(".video-header", {
      origin: "top",
      distance: "30px",
      duration: 1000,
    });

    sr.reveal(".video-container", {
      origin: "bottom",
      viewFactor: 0.2,
    });

    sr.reveal(".video-feature", {
      origin: "bottom",
      interval: 150,
      viewFactor: 0.2,
    });
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showVideo]);

  const features = [
    { icon: Car, text: "500+ Premium Vehicles", color: "text-cyan-600" },
    { icon: Users, text: "50K+ Happy Customers", color: "text-teal-600" },
    { icon: Award, text: "Award Winning Service", color: "text-yellow-500" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="video-header text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 px-4 py-2 rounded-full font-semibold text-sm border border-cyan-200">
            <Play className="w-4 h-4" />
            <span>Watch Our Story</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900">
            Experience The{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Difference
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover why thousands of customers trust us for their car rental
            needs. Watch our story and see what makes us special.
          </p>
        </div>

        {/* Main Video Container */}
        <div className="video-container relative">
          {/* Decorative Background Elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl"></div>

          {/* Video Card */}
          <div
            className="relative group overflow-hidden rounded-3xl shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Image */}
            <img
              src={videoImg}
              alt="Video Preview"
              className={`w-full h-[500px] object-cover transition-transform duration-700 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div
              className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
            ></div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              {/* Play Button */}
              <button
                onClick={() => setShowVideo(true)}
                className="relative group/play mb-6"
              >
                {/* Outer Pulse Rings */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="absolute inline-flex h-24 w-24 rounded-full bg-white/30 animate-ping"></span>
                  <span className="absolute inline-flex h-32 w-32 rounded-full bg-white/20 animate-ping animation-delay-1000"></span>
                </span>

                {/* Main Play Button */}
                <span
                  className={`relative flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-2xl transition-all duration-500 ${
                    isHovered
                      ? "scale-110 bg-gradient-to-br from-cyan-600 to-teal-600"
                      : "scale-100"
                  }`}
                >
                  <Play
                    className={`w-10 h-10 ml-1 transition-colors duration-500 ${
                      isHovered ? "text-white" : "text-cyan-600"
                    }`}
                    fill="currentColor"
                  />
                </span>
              </button>

              {/* Text Content */}
              <div
                className={`text-center space-y-3 transform transition-all duration-500 ${
                  isHovered
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  See How We Work
                </h3>
                <p className="text-white/90 text-sm md:text-base max-w-md">
                  Take a virtual tour of our services and fleet
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="video-feature bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center`}
                  >
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {feature.text}
                    </p>
                    <p className="text-sm text-gray-500">Trusted & Verified</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowVideo(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm"></div>

          {/* Modal Container */}
          <div
            className="relative z-10 w-full max-w-6xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-14 right-0 flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg group"
            >
              <X className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
              <span>Close</span>
            </button>

            {/* Video Container */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video">
              {/* Fullscreen Button */}
              <button className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white p-2 rounded-lg transition-all duration-300 hover:scale-110">
                <Maximize2 className="w-5 h-5" />
              </button>

              {/* YouTube Video */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/c0C5Vl1CNQs?autoplay=1&rel=0&modestbranding=1"
                title="Car Rental Video"
                frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>

            {/* Video Info Below */}
            <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Our Journey & Commitment
                  </h3>
                  <p className="text-white/80 text-sm">
                    Learn about our mission to provide the best car rental
                    experience
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                  <span>⭐</span>
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
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
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default VideoSection;
