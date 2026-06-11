import ProjectCard from './ProjectCard'
import type { Project } from '@/lib/types'

interface Props {
  projects: Project[]
}

export default function ProjectGrid({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-24 text-[#5A5651]" style={{ fontFamily: 'Inter, sans-serif' }}>
        No projects yet.
      </div>
    )
  }

  return (
    <section className="px-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-8 h-px bg-[#C4603E]" />
          <h2
            className="text-2xl md:text-3xl font-semibold text-[#1C1C1A]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Projects
          </h2>
          <div className="flex-1 h-px bg-[rgba(28,28,26,0.12)]" />
          <span className="text-sm text-[#5A5651]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {projects.length} teams
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
