import React, { useEffect, useState } from 'react'
import ScrollReveal from 'scrollreveal'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import axios from 'axios'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    ScrollReveal().reveal('.contact-card', {
      distance: '50px',
      origin: 'bottom',
      duration: 1000,
      interval: 200,
      easing: 'ease-in-out',
    })
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')

    try {
      // Replace user_id with actual logged-in user ID or null if guest
      

      await axios.post("http://localhost:1000/contact")

      setSuccess("Message sent successfully!")
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      console.error("Contact form error:", err)
      setSuccess("Failed to send message. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-5 my-20 flex flex-col gap-16">
      {/* Heading */}
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-gray-600 text-lg">
          We’d love to hear from you. Get in touch with us anytime.
        </p>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="contact-card border rounded-lg p-6 text-center hover:shadow-lg transition">
          <Phone className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Phone</h3>
          <p className="text-gray-600 mt-2">+91 90224 85182</p>
        </div>

        <div className="contact-card border rounded-lg p-6 text-center hover:shadow-lg transition">
          <Mail className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Email</h3>
          <p className="text-gray-600 mt-2">support@carrent.com</p>
        </div>

        <div className="contact-card border rounded-lg p-6 text-center hover:shadow-lg transition">
          <MapPin className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Location</h3>
          <p className="text-gray-600 mt-2">Pune, Maharashtra</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="contact-card max-w-3xl mx-auto w-full border rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Send Us a Message</h2>

        {success && (
          <p className={`text-center mb-4 ${success.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {success}
          </p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Your Name"
            onChange={handleChange}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Your Email"
            onChange={handleChange}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <input
            type="text"
            name="subject"
            value={formData.subject}
            placeholder="Subject"
            onChange={handleChange}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          <textarea
            rows="4"
            name="message"
            value={formData.message}
            placeholder="Your Message"
            onChange={handleChange}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-semibold transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
