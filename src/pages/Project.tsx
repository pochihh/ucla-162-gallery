import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { Badge } from '@/components/ui/badge'
import Footer from '@/components/Footer'
import GridOverlay from '@/components/GridOverlay'
import type { Project as ProjectType } from '@/lib/types'
import 'highlight.js/styles/github.css'

export default function Project() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<ProjectType | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch('/ucla-162-gallery/data/projects.json')
      .then((r) => r.json())
      .then((projects: ProjectType[]) => {
        const found = projects.find((p) => p.slug === slug)
        if (found) setProject(found)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl text-[#1C1C1A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Project not found.
        </p>
        <Link to="/" className="text-sm text-[#C4603E] underline underline-offset-4">
          ← Back to gallery
        </Link>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#5A5651]" style={{ fontFamily: 'Inter, sans-serif' }}>Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-[#C8C0B6]">
        <GridOverlay opacity={0.08} />
        {project.thumbnail && (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="relative z-10 h-full flex flex-col items-start justify-end px-8 pb-8 max-w-5xl mx-auto w-full">
          <Link
            to="/"
            className="text-xs tracking-[0.2em] uppercase text-[#5A5651] hover:text-[#C4603E] transition-colors mb-4"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            ← Gallery
          </Link>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1C1C1A] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {project.title}
          </h1>
        </div>
      </div>

      {/* Metadata */}
      <div className="px-8 py-8 max-w-5xl mx-auto w-full">
        <div className="flex flex-wrap items-start gap-6 pb-6 border-b border-[rgba(28,28,26,0.12)]">
          {/* Authors */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#6B7C5E] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Authors
            </p>
            <div className="flex flex-wrap gap-1">
              {project.authors.map((a) => (
                <Badge key={a} variant="secondary" className="bg-[#D6CFC6] text-[#1C1C1A] border-0 rounded-full">
                  {a}
                </Badge>
              ))}
            </div>
          </div>

          {/* Keywords */}
          {project.keywords.length > 0 && (
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#6B7C5E] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Topics
              </p>
              <div className="flex flex-wrap gap-1">
                {project.keywords.map((k) => (
                  <Badge key={k} variant="outline" className="border-[rgba(28,28,26,0.2)] text-[#5A5651] rounded-full">
                    {k}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Stars + contributors */}
          <div className="ml-auto flex items-center gap-4">
            {project.stars > 0 && (
              <span className="text-sm text-[#5A5651]" style={{ fontFamily: 'Inter, sans-serif' }}>
                ★ {project.stars}
              </span>
            )}
            <div className="flex -space-x-2">
              {project.contributors.slice(0, 5).map((c) => (
                <a key={c.login} href={c.html_url} target="_blank" rel="noreferrer">
                  <img
                    src={c.avatar_url}
                    alt={c.login}
                    title={c.login}
                    className="w-7 h-7 rounded-full border-2 border-[#D6CFC6] object-cover"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Summary + links */}
        {(project.summary || project.demo_url || project.video_url) && (
          <div className="py-6 border-b border-[rgba(28,28,26,0.12)]">
            {project.summary && (
              <p className="text-base text-[#1C1C1A] leading-relaxed mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                {project.summary}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4603E] text-white text-sm transition-opacity hover:opacity-80"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Live Demo →
                </a>
              )}
              {project.video_url && (
                <a
                  href={project.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(28,28,26,0.2)] text-[#1C1C1A] text-sm transition-colors hover:border-[#C4603E] hover:text-[#C4603E]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  ▶ Watch Video
                </a>
              )}
            </div>
          </div>
        )}

        {/* README */}
        {project.readme && (
          <div
            className="py-8 prose prose-stone max-w-none"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {project.readme}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
