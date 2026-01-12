import React, { useEffect, useState } from "react";
import ScrollReveal from "scrollreveal";
import userApi from "../utils/userApi";

import {
  Phone,
  Mail,
  MapPin,
  Send,
  Clock,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  CheckCircle2,
  Sparkles,
  User,
  AtSign,
  MessageSquare,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const sr = ScrollReveal({
      reset: false,
      distance: "60px",
      duration: 1200,
      easing: "ease-in-out",
    });
    sr.reveal(".page-header", { origin: "top", distance: "30px" });
    sr.reveal(".contact-info-card", {
      origin: "bottom",
      interval: 150,
      viewFactor: 0.2,
    });
    sr.reveal(".contact-form-section", { origin: "left", delay: 200 });
    sr.reveal(".map-section", { origin: "right", delay: 200 });
    sr.reveal(".faq-item", {
      origin: "bottom",
      interval: 100,
      viewFactor: 0.2,
    });
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    const res = await userApi.post("/contact", payload);

    setIsSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

    setTimeout(() => setIsSubmitted(false), 5000);
  } catch (err) {
    alert(err?.response?.data?.message || "Failed to send message");
  } finally {
    setIsSubmitting(false);
  }
};


  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: "+91 90224 85182",
      link: "tel:+919022485182",
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      icon: Mail,
      title: "Email",
      value: "support@carhub.com",
      link: "mailto:support@carhub.com",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Pune, Maharashtra, India",
      link: "https://maps.google.com",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Clock,
      title: "Working Hours",
      value: "Mon - Sat: 9AM - 8PM",
      link: null,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
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

  const faqs = [
    {
      question: "What documents do I need to rent a car?",
      answer:
        "Valid driving license, ID proof (Aadhar/PAN), and a security deposit.",
    },
    {
      question: "Can I extend my rental period?",
      answer:
        "Yes, contact us at least 24 hours before your return time to extend.",
    },
    {
      question: "Do you offer delivery and pickup?",
      answer: "Yes, we offer doorstep delivery and pickup within city limits.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-30 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="page-header text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 px-4 py-2 rounded-full font-semibold text-sm border border-cyan-200">
            <MessageCircle className="w-5 h-5" />
            <span>Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">
            Contact{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Us
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Get in touch with us anytime and we'll
            respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <a
                key={index}
                href={info.link || "#"}
                className={`contact-info-card group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-center border border-gray-100 ${
                  info.link ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600 text-sm">{info.value}</p>
              </a>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="contact-form-section">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form and our team will get back to you within 24
                  hours
                </p>
              </div>

              {isSubmitted && (
                <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-2xl p-4 flex items-center gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-green-900">
                      Message sent successfully!
                    </p>
                    <p className="text-sm text-green-700">
                      We'll get back to you soon.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:bg-white focus:outline-none transition-all text-gray-900 font-medium resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="map-section">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-cyan-500" />
                    Find Us Here
                  </h3>
                </div>
                <div className="aspect-video bg-gray-100 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242118.2271673383!2d73.72017565!3d18.5204303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="CarHub Location"
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-600 via-teal-600 to-cyan-700 rounded-3xl p-8 shadow-xl text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black">Office Hours</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <span className="font-semibold">Monday - Friday</span>
                  <span className="font-bold">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <span className="font-semibold">Saturday</span>
                  <span className="font-bold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <span className="font-semibold">Sunday</span>
                  <span className="font-bold">10:00 AM - 4:00 PM</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-white/90 text-sm mb-3">
                  Connect with us on social media
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.url}
                        aria-label={social.name}
                        className={`w-11 h-11 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white hover:text-cyan-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 border border-white/30`}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">
                Quick Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-colors">
                        <span className="font-bold text-gray-900">
                          {faq.question}
                        </span>
                        <span className="text-cyan-500 transform group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <p className="mt-3 text-gray-600 px-4 pb-2">
                        {faq.answer}
                      </p>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl text-center text-white">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-3xl font-black mb-4">
            Need Immediate Assistance?
          </h3>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
            Our 24/7 emergency helpline is always available for urgent support
          </p>
          <a
            href="tel:+919022485182"
            className="inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            <Phone className="w-5 h-5" />
            <span>Call Emergency Hotline</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Contact;
