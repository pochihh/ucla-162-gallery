import type { Transition } from 'framer-motion'
import { motion } from 'framer-motion'

// ── Tuning params ──────────────────────────────────────────────────────────
const FLOAT = 10  // px: float oscillation amplitude
// ──────────────────────────────────────────────────────────────────────────

// Derived from TITLE_HALF=160, POKE=50: desktop rest = 110px from center.
// Container inner edge = MAX POKE = rest − FLOAT = 100px from center (desktop).
// MOBILE_OFFSET_VW: percentage of viewport width used as container offset on mobile.
// Larger % → finger further from center → less poke, but slightly less hand visible.
// (6.9vw was original; 12vw gives gentler mobile poke)
const MOBILE_OFFSET_VW = 12
const CONTAINER_OFFSET_CSS = `clamp(15px, ${MOBILE_OFFSET_VW}vw, 100px)`

// Image width — responsive. Extra beyond 50vw: clamp(50px→mobile, 300px→desktop)
// ensures the arm always extends off-screen while keeping image size appropriate.
const IMG_WIDTH = 'calc(50vw + clamp(50px, 20vw, 300px))'


const floatTransition: Transition = {
  duration: 3,
  repeat: Infinity,
  repeatType: 'mirror',
  ease: 'easeInOut',
  delay: 1.8,
}

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* ── ADAM'S HAND ──────────────────────────────────────────────────
          Container: right edge = max-poke; auto height = full image height (no crop).
          Image: width-explicit so arm is always off-screen; height:auto = no distortion.
          Float: x = −2×FLOAT → 0 → mirror; average = −FLOAT = rest position.         */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          right: `calc(50% + ${CONTAINER_OFFSET_CSS})`,
          width: IMG_WIDTH,
        }}
        initial={{ x: '-110%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
      >
        <motion.div
          initial={{ x: -2 * FLOAT }}
          animate={{ x: 0 }}
          transition={floatTransition}
        >
          <img
            src="/ucla-162-gallery/images/adam-hand.png"
            alt=""
            className="block select-none drop-shadow-xl"
            style={{ width: IMG_WIDTH, height: 'auto' }}
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* ── GOD'S HAND ───────────────────────────────────────────────────
          Mirror: container left edge = max-poke; arm off right.
          Float: x = +2×FLOAT → 0 → mirror; average = +FLOAT = rest position.         */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          left: `calc(50% + ${CONTAINER_OFFSET_CSS})`,
          width: IMG_WIDTH,
        }}
        initial={{ x: '110%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
      >
        <motion.div
          initial={{ x: 2 * FLOAT }}
          animate={{ x: 0 }}
          transition={floatTransition}
        >
          <img
            src="/ucla-162-gallery/images/god-hand.png"
            alt=""
            className="block select-none drop-shadow-xl"
            style={{ width: IMG_WIDTH, height: 'auto' }}
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* ── TITLE + QUOTE ── single centered column, no collision ──────── */}
      <motion.div
        className="absolute z-10 inset-x-0 flex flex-col items-center text-center pointer-events-none"
        style={{ top: 'calc(50% - 3.5rem)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.6 }}
      >
        <p
          className="text-xs md:text-sm tracking-[0.35em] uppercase text-[#5A5651] mb-2"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          UCLA MAE
        </p>
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-none text-[#1C1C1A]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Capstone
        </h1>
        <p
          className="text-lg md:text-2xl lg:text-3xl tracking-[0.2em] text-[#C4603E] mt-2"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          162D / E
        </p>
        <p
          className="text-xs tracking-[0.25em] uppercase text-[#5A5651] mt-4"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          2026 Project Gallery
        </p>

        {/* Quote sits naturally below in the same flow */}
        <div className="relative mt-10 md:mt-14 max-w-xs md:max-w-md text-center px-6 md:px-8">
          <span
            className="absolute -top-6 left-0 md:-top-8 md:-left-2 text-6xl md:text-8xl leading-none text-[#C4603E] opacity-75 select-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            aria-hidden
          >
            &ldquo;
          </span>
          <p
            className="text-xl md:text-2xl lg:text-3xl italic text-[#5A5651] tracking-wide leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Bridging Academic Knowledge and Hands-on Engineering
          </p>
          <span
            className="absolute -bottom-10 right-0 md:-bottom-12 md:-right-2 text-6xl md:text-8xl leading-none text-[#C4603E] opacity-75 select-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            aria-hidden
          >
            &rdquo;
          </span>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
      >
        <span
          className="text-xs tracking-[0.2em] uppercase text-[#5A5651]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
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
