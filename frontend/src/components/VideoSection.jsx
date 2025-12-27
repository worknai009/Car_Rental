import React, { useEffect, useState } from 'react'
import ScrollReveal from 'scrollreveal'
import videoImg from '../assets/video-img.jfif'
import { Play, X } from 'lucide-react'

const VideoSection = () => {
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    const sr = ScrollReveal({
      reset: false,
      distance: '60px',
      duration: 1200,
      easing: 'ease-in-out',
    })

    // Image animation
    sr.reveal('.video-img', {
      origin: 'bottom',
      viewFactor: 0.2,
    })

    // Play button animation
    sr.reveal('.video-play', {
      scale: 0.7,
      delay: 200,
      viewFactor: 0.2,
    })
  }, [])

  return (
    <section className="my-20 px-5 max-w-6xl mx-auto">

      {/* Image Container */}
      <div className="relative group overflow-hidden rounded-xl">

        <img
          src={videoImg}
          alt="Video Preview"
          className="video-img w-full h-96 object-cover rounded-xl"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 rounded-xl"></div>

        {/* Play Button */}
        <button
          onClick={() => setShowVideo(true)}
          className="video-play absolute inset-0 flex items-center justify-center"
        >
          <span className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white/90 backdrop-blur-md shadow-xl transition-transform duration-300 group-hover:scale-110">

            {/* Pulse Effect */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-30 animate-ping"></span>

            <Play className="w-10 h-10 text-red-600 ml-1" />
          </span>
        </button>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="relative bg-black rounded-xl w-full max-w-4xl aspect-video">

            {/* Close Button */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            {/* YouTube Video */}
            <iframe
              className="w-full h-full rounded-xl"
              src="https://www.youtube.com/embed/c0C5Vl1CNQs?autoplay=1"
              title="Car Rental Video"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

    </section>
  )
}

export default VideoSection
