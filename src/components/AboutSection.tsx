import { forwardRef } from 'react'

const AboutSection = forwardRef<HTMLElement>(function AboutSection(_, ref) {
  return (
    <section ref={ref} className="relative py-28 px-4 sm:px-8 md:py-32">
      <div className="mx-auto max-w-[720px] px-0 text-center sm:px-6">
        <p
          className="text-xs tracking-[0.3em] uppercase text-[#6B7C5E] mb-4"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          University of California, Los Angeles
        </p>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1C1C1A] mb-6 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          MAE 162D/E — Mechanical & Aerospace Engineering Capstone
        </h2>
        <div className="faded-terracotta-line w-100 h-1 mx-auto mb-6" />
        <p
          lang="en"
          className="mx-auto max-w-[680px] text-justify text-[15px] leading-relaxed text-[#5A5651] [hyphens:auto] [text-align-last:left] sm:text-base sm:[text-align-last:center] md:text-lg"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Each year, senior students in the Department of Mechanical and
          Aerospace Engineering come together in teams to design, build, and
          test solutions to real-world engineering challenges, from autonomous
          systems and medical devices to clean energy and structural design.
          This gallery highlights the creativity, technical effort, and final
          projects of the 2026 cohort from Professor Tsao's and Professor Yen's
          sections.
        </p>
      </div>
    </section>
  )
})

export default AboutSection
