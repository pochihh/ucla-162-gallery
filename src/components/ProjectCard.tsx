import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/lib/types'

interface Props {
  project: Project
}

export default function ProjectCard({ project }: Props) {
  return (
    <Link to={`/project/${project.slug}`} className="group block">
      <Card className="overflow-hidden border-0 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 bg-[#E8E2DA]">
        {/* Thumbnail */}
        <div className="aspect-video overflow-hidden bg-[#D0C9C0]">
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

        <CardContent className="p-4">
          <h3
            className="text-lg font-semibold text-[#1C1C1A] mb-1 leading-snug group-hover:text-[#C4603E] transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {project.title}
          </h3>
          <p className="text-xs text-[#5A5651] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            {project.authors.join(', ')}
          </p>
          {project.summary && (
            <p className="text-sm text-[#5A5651] line-clamp-2 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              {project.summary}
            </p>
          )}
          <div className="flex flex-wrap gap-1">
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
