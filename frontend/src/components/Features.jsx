import React, { useEffect } from 'react'
import ScrollReveal from 'scrollreveal'
import {
  Shield,
  Clock4,
  CreditCard,
  Headphones,
  FileBadge,
  Users,
} from 'lucide-react'

const features = [
  {
    title: "Wide Selection of Vehicles",
    description: "Choose from a diverse range of vehicles to suit your needs.",
    icon: <Users className="w-8 h-8 text-white" />,
  },
  {
    title: "24/7 Customer Support",
    description: "Our dedicated support team is available around the clock.",
    icon: <Headphones className="w-8 h-8 text-white" />,
  },
  {
    title: "Fast and Easy Booking",
    description: "Book your vehicle in just a few clicks.",
    icon: <Clock4 className="w-8 h-8 text-white" />,
  },
  {
    title: "Secure Payment Options",
    description: "Safe and secure payment methods for all transactions.",
    icon: <CreditCard className="w-8 h-8 text-white" />,
  },
  {
    title: "Flexible Rental Terms",
    description: "Rent for as long or short as you need.",
    icon: <FileBadge className="w-8 h-8 text-white" />,
  },
  {
    title: "Reliable and Well-Maintained Vehicles",
    description: "All vehicles are regularly serviced and maintained.",
    icon: <Shield className="w-8 h-8 text-white" />,
  },
]

const Features = () => {
  useEffect(() => {
    const sr = ScrollReveal({
      reset: false,
      distance: '60px',
      duration: 1200,
      easing: 'ease-in-out',
      opacity: 0,          // 🔑 KEY FIX
      viewFactor: 0.2,     // 🔑 Forces animation even if partly visible
    })

    // Heading animation
    sr.reveal('.features-heading', {
      origin: 'top',
      delay: 100,
    })

    // Cards animation (ALL cards including first)
    sr.reveal('.feature-card', {
      origin: 'bottom',
      interval: 150,
      delay: 200,          // 🔑 Forces first card animation
    })
  }, [])

  return (
    <section className="py-20 bg-gray-50">
      {/* Heading */}
      <div className="features-heading text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Why Choose Us?
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          We offer the best car rental experience with a wide selection of
          vehicles and exceptional service.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-5 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 text-center"
          >
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-gradient-to-tr from-red-500 to-red-700 shadow-lg">
              {feature.icon}
            </div>

            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
