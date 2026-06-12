import { useEffect, useRef, useState } from 'react'
import Hero from '@/components/Hero'
import AboutSection from '@/components/AboutSection'
import ProjectGrid, { PROJECT_HEADER_CENTER_OFFSET } from '@/components/ProjectGrid'
import Footer from '@/components/Footer'
import PageGrid from '@/components/PageGrid'
import { CELL } from '@/components/GridOverlay'
import type { Project } from '@/lib/types'

const FALLBACK_ABOUT_H = 650
const EXTRA_PROJECT_GRID_ROWS = 1

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const aboutRef = useRef<HTMLElement>(null)
  const [aboutBottom, setAboutBottom] = useState(900 + FALLBACK_ABOUT_H)

  useEffect(() => {
    fetch('/ucla-162-gallery/data/projects.json')
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => setProjects([]))
  }, [])

  useEffect(() => {
    const sync = () => {
      const about = aboutRef.current
      setAboutBottom(about ? about.offsetTop + about.offsetHeight : window.innerHeight + FALLBACK_ABOUT_H)
    }

    sync()
    window.addEventListener('resize', sync)

    const observer = new ResizeObserver(sync)
    if (aboutRef.current) observer.observe(aboutRef.current)

    document.fonts?.ready.then(sync)

    return () => {
      window.removeEventListener('resize', sync)
      observer.disconnect()
    }
  }, [])

  // Close the merged block at the first grid line after About, then continue
  // regular grid cells down to the Projects divider line.
  const mergedEnd = Math.ceil(aboutBottom / CELL) * CELL
  const projectLine = mergedEnd + EXTRA_PROJECT_GRID_ROWS * CELL
  const projPT = projectLine - aboutBottom - PROJECT_HEADER_CENTER_OFFSET

  return (
    <div className="relative min-h-screen">
      {/* Page-level grid: single SVG, with the merged block closed before Projects */}
      <PageGrid mergedEnd={mergedEnd} gridEnd={projectLine} />
      <Hero />
      <AboutSection ref={aboutRef} />
      <ProjectGrid projects={projects} topPad={projPT} />
      <Footer />
    </div>
  )
}
