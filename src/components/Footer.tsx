export default function Footer() {
  return (
    <footer className="border-t border-[rgba(28,28,26,0.12)] py-8 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#5A5651]" style={{ fontFamily: 'Inter, sans-serif' }}>
          © 2026 UCLA Mechanical & Aerospace Engineering
        </p>
        <p
          className="text-sm text-[#5A5651] italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          MAE 162D/E Capstone Gallery
        </p>
      </div>
    </footer>
  )
}
