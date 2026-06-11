import type { Transition } from 'framer-motion'
import { motion } from 'framer-motion'
import GridOverlay from './GridOverlay'

// ── Tuning params ──────────────────────────────────────────────────────────
const TITLE_HALF = 160  // px: half-width of the title zone
const POKE       = 50   // px: finger intrudes into title at rest
const FLOAT      = 10   // px: float oscillation amplitude
// ──────────────────────────────────────────────────────────────────────────

// Fingertip rest position: INNER_OFFSET px from screen center
const INNER_OFFSET = TITLE_HALF - POKE  // 110px

// Container inner edge is placed at the MAX POKE position (= rest + FLOAT closer to center).
// overflow:hidden on the container then never clips the poke side.
const CONTAINER_OFFSET = INNER_OFFSET - FLOAT  // 100px

// Image width drives arm coverage — explicit, width-first so height:auto gives
// natural aspect ratio with zero distortion. The arm extends off-screen as long
// as IMG_WIDTH > (50vw − CONTAINER_OFFSET).
// calc(50vw + 300px) provides ~400px of margin even at max retraction (x=−2×FLOAT).
const IMG_WIDTH = 'calc(50vw + 300px)'


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
      <GridOverlay />

      {/* ── ADAM'S HAND ──────────────────────────────────────────────────
          Container: right edge = max-poke; auto height = full image height (no crop).
          Image: width-explicit so arm is always off-screen; height:auto = no distortion.
          Float: x = −2×FLOAT → 0 → mirror; average = −FLOAT = rest position.         */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          right: `calc(50% + ${CONTAINER_OFFSET}px)`,
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
          left: `calc(50% + ${CONTAINER_OFFSET}px)`,
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

      {/* ── TITLE ── z-10, fingers layer underneath ──────────────────── */}
      <motion.div
        className="absolute z-10 inset-x-0 top-1/2 -translate-y-1/2
                   flex flex-col items-center text-center pointer-events-none"
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
