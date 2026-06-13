import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/lib/types'

interface Props {
  project: Project
}

const rankingCrowns = {
  1: {
    src: `${import.meta.env.BASE_URL}images/crown-gold.png`,
    label: 'First place',
  },
  2: {
    src: `${import.meta.env.BASE_URL}images/crown-silver.png`,
    label: 'Second place',
  },
  3: {
    src: `${import.meta.env.BASE_URL}images/crown-bronze.png`,
    label: 'Third place',
  },
} as const

export default function ProjectCard({ project }: Props) {
  const rankingCrown = project.ranking ? rankingCrowns[project.ranking] : null

  return (
    <Link to={`/project/${project.slug}`} className="group block h-full">
      <Card className="relative h-full overflow-visible border-0 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 bg-[#E8E2DA]">
        {rankingCrown && (
          <span className="ranking-crown" aria-hidden="true">
            <span className="ranking-crown-glow" />
            <img
              src={rankingCrown.src}
              alt=""
              className="ranking-crown-image"
            />
          </span>
        )}

        {/* Thumbnail */}
        <div className="aspect-video overflow-hidden rounded-t-xl bg-[#D0C9C0]">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl text-[#B0A89E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {project.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col p-4">
          <p className="text-xs text-[#6B7C5E] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            {project.section} · Group {project.group} · {project.year}
          </p>
          <h3
            className="min-h-[3rem] text-lg font-semibold text-[#1C1C1A] mb-2 leading-snug line-clamp-2 group-hover:text-[#C4603E] transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {project.title}
          </h3>
          <p className="min-h-[3rem] text-xs text-[#5A5651] mb-3 leading-relaxed line-clamp-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            {project.authors.join(', ')}
          </p>
          <p className="min-h-[2.75rem] text-sm text-[#5A5651] line-clamp-2 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            {project.summary}
          </p>
          <div className="mt-auto flex flex-wrap gap-1">
            {project.keywords.slice(0, 3).map((kw) => (
              <Badge
                key={kw}
                variant="secondary"
                className="text-xs bg-[#D6CFC6] text-[#5A5651] border-0 rounded-full px-2 py-0.5"
              >
                {kw}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
