export default function AboutSection() {
  return (
    <section className="relative py-24 px-8">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[#6B7C5E] mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          University of California, Los Angeles
        </p>
        <h2
          className="text-4xl md:text-5xl font-semibold text-[#1C1C1A] mb-6 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          MAE 162D/E — Mechanical & Aerospace Engineering Capstone
        </h2>
        <div className="w-12 h-px bg-[#C4603E] mx-auto mb-6" />
        <p className="text-base md:text-lg text-[#5A5651] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
          Each year, senior students in the Mechanical & Aerospace Engineering department
          form teams to tackle real engineering challenges—from autonomous systems and
          medical devices to clean energy and structural design. This gallery showcases
          the 2026 cohort's work.
        </p>
      </div>
    </section>
  )
}
