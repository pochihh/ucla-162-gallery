import { motion } from 'framer-motion'
import GridOverlay from './GridOverlay'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GridOverlay />

      <div className="relative z-10 flex items-center justify-center gap-0 px-8 w-full max-w-6xl mx-auto">

        {/* Adam's hand — entrance from left, then gentle float */}
        <motion.div
          className="flex-shrink-0"
          initial={{ x: -220, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ x: -6 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 1.8 }}
          >
            <img
              src="/ucla-162-gallery/images/adam-hand.png"
              alt="Adam's hand reaching forward"
              className="w-64 md:w-80 lg:w-96 drop-shadow-lg select-none"
              draggable={false}
            />
          </motion.div>
        </motion.div>

        {/* Title block between the fingertips */}
        <motion.div
          className="flex-shrink-0 text-center px-6 md:px-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <p
            className="text-sm md:text-base tracking-[0.25em] uppercase text-[#5A5651] mb-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            UCLA MAE
          </p>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-none text-[#1C1C1A]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Capstone
          </h1>
          <p
            className="text-2xl md:text-3xl lg:text-4xl tracking-widest text-[#C4603E] mt-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            162D / E
          </p>
          <p
            className="text-xs md:text-sm tracking-[0.2em] uppercase text-[#5A5651] mt-4"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            2026 Project Gallery
          </p>
        </motion.div>

        {/* God's hand — entrance from right, then gentle float */}
        <motion.div
          className="flex-shrink-0"
          initial={{ x: 220, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ x: 6 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 1.8 }}
          >
            <img
              src="/ucla-162-gallery/images/god-hand.png"
              alt="God's hand pointing forward"
              className="w-64 md:w-80 lg:w-96 drop-shadow-lg select-none"
              draggable={false}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
      >
        <span className="text-xs tracking-[0.2em] uppercase text-[#5A5651]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Scroll
        </span>
        <motion.div
          className="w-px h-8 bg-[#5A5651] origin-top"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
