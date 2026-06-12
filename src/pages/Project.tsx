import {
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { MarkGithubIcon, StarIcon } from '@primer/octicons-react'
import { Check, Copy } from 'lucide-react'
import Footer from '@/components/Footer'
import GridOverlay from '@/components/GridOverlay'
import type { Project as ProjectType } from '@/lib/types'

function getTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getTextContent).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return getTextContent(node.props.children)
  return ''
}

function formatStars(stars: number) {
  if (stars < 1000) return String(stars)
  return `${(stars / 1000).toFixed(stars < 10000 ? 1 : 0)}k`
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return
    } catch {
      // Fall through to the legacy copy path for restricted browser contexts.
    }
  }

  const textArea = document.createElement('textarea')
  textArea.value = value
  textArea.setAttribute('readonly', '')
  textArea.style.position = 'fixed'
  textArea.style.top = '-9999px'
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}

function ReadmeCodeBlock({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<number | null>(null)
  const code = getTextContent(children)

  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current)
    }
  }, [])

  const handleCopy = async () => {
    await copyText(code)
    setCopied(true)
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="project-readme-code-block">
      <pre {...props}>{children}</pre>
      <button
        type="button"
        className="project-readme-copy-button"
        aria-label={copied ? 'Copied code' : 'Copy code'}
        title={copied ? 'Copied' : 'Copy'}
        onClick={handleCopy}
      >
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      </button>
    </div>
  )
}

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

      <div className="px-8 py-8 max-w-5xl mx-auto w-full">
        <div className="project-meta-grid pb-5 border-b border-[rgba(28,28,26,0.12)]">
          <div className="project-meta-heading">
            <p
              className="relative z-10 text-2xl md:text-3xl leading-9 font-semibold text-[#1C1C1A]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {project.year} <span className="text-[#8A8178]">&middot;</span> {project.section}{' '}
              <span className="text-[#8A8178]">&middot;</span> Group {project.group}
            </p>
          </div>

          <div className="project-meta-actions" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="project-github-actions">
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="project-github-button project-github-button-primary"
              >
                <MarkGithubIcon size={16} aria-hidden="true" />
                GitHub Repo
              </a>
              <a
                href={`${project.repo_url}/stargazers`}
                target="_blank"
                rel="noreferrer"
                className="project-github-button project-github-button-stars"
                aria-label={`${project.stars} GitHub stars`}
                title={`${project.stars} GitHub stars`}
              >
                <StarIcon size={16} aria-hidden="true" />
                {formatStars(project.stars)}
              </a>
            </div>
          </div>

          <div className="project-meta-detail" style={{ fontFamily: 'Inter, sans-serif' }}>
            <p className="text-xs tracking-[0.2em] uppercase text-[#6B7C5E] mb-2">
              Authors
            </p>
            <p className="text-sm leading-relaxed text-[#1C1C1A]">
              {project.authors.join(', ')}
            </p>
          </div>

          <div className="project-meta-detail md:text-right" style={{ fontFamily: 'Inter, sans-serif' }}>
            <p className="text-xs tracking-[0.2em] uppercase text-[#6B7C5E] mb-2">
              Keywords
            </p>
            <p className="text-sm leading-relaxed text-[#5A5651]">
              {project.keywords.length > 0 ? project.keywords.join(', ') : 'None'}
            </p>
          </div>
        </div>

        {/* README */}
        {project.readme && (
          <article className="markdown-body project-readme-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{ pre: ReadmeCodeBlock }}
            >
              {project.readme}
            </ReactMarkdown>
          </article>
        )}
      </div>

      <Footer />
    </div>
  )
}
