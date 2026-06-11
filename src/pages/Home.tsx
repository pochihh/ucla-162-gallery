import { useEffect, useState } from 'react'
import Hero from '@/components/Hero'
import AboutSection from '@/components/AboutSection'
import ProjectGrid from '@/components/ProjectGrid'
import Footer from '@/components/Footer'
import type { Project } from '@/lib/types'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch('/ucla-162-gallery/data/projects.json')
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => setProjects([]))
  }, [])

  return (
    <div className="min-h-screen">
      <Hero />
      <AboutSection />
      <ProjectGrid projects={projects} />
      <Footer />
    </div>
  )
}
