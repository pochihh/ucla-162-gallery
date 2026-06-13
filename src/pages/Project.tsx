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
import { Badge } from '@/components/ui/badge'
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

const rankingCrowns = {
  1: `${import.meta.env.BASE_URL}images/crown-gold.png`,
  2: `${import.meta.env.BASE_URL}images/crown-silver.png`,
  3: `${import.meta.env.BASE_URL}images/crown-bronze.png`,
} as const

function normalizeYouTubeIframes(markdown: string) {
  return markdown.replace(
    /<iframe\b[^>]*\bsrc=(["'])([^"']*(?:youtube\.com|youtu\.be)[^"']*)\1[^>]*>\s*<\/iframe>/gi,
    (_, _quote: string, src: string) => `\n\n${src}\n\n`
  )
}

function normalizeReadmeMarkdown(markdown: string) {
  const lines = markdown.split('\n')
  let normalized = ''
  let normalBlock = ''
  let fenceChar: '`' | '~' | null = null
  let fenceLength = 0

  function flushNormalBlock() {
    normalized += normalizeYouTubeIframes(normalBlock)
    normalBlock = ''
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const lineWithBreak = `${line}${index < lines.length - 1 ? '\n' : ''}`
    const openingFence = line.match(/^ {0,3}(`{3,}|~{3,})/)

    if (!fenceChar && openingFence) {
      flushNormalBlock()
      normalized += lineWithBreak
      fenceChar = openingFence[1][0] as '`' | '~'
      fenceLength = openingFence[1].length
      continue
    }

    if (fenceChar) {
      normalized += lineWithBreak
      const closingFence = new RegExp(`^ {0,3}\\${fenceChar}{${fenceLength},}\\s*$`)
      if (closingFence.test(line)) {
        fenceChar = null
        fenceLength = 0
      }
      continue
    }

    normalBlock += lineWithBreak
  }

  flushNormalBlock()
  return normalized
}

function encodePathSegments(path: string) {
  return path
    .split('/')
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join('/')
}

function isExternalReference(value: string) {
  return /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//')
}

function splitReference(value: string) {
  const hashStart = value.indexOf('#')
  const beforeHash = hashStart === -1 ? value : value.slice(0, hashStart)
  const hash = hashStart === -1 ? '' : value.slice(hashStart)
  const queryStart = beforeHash.indexOf('?')

  if (queryStart === -1) {
    return { path: beforeHash, suffix: hash }
  }

  return {
    path: beforeHash.slice(0, queryStart),
    suffix: `${beforeHash.slice(queryStart)}${hash}`,
  }
}

function cleanRepoPath(path: string) {
  const cleanPath = path.replace(/^\.\/+/, '').replace(/^\/+/, '')
  if (!cleanPath || cleanPath.split('/').includes('..')) return null
  return cleanPath
}

function resolveReadmeLink(href: string | undefined, project: ProjectType) {
  if (!href || href.startsWith('#') || isExternalReference(href)) return href

  const { path, suffix } = splitReference(href)
  const cleanPath = cleanRepoPath(path)
  if (!cleanPath) return href

  const branch = project.default_branch || 'main'
  return `${project.repo_url}/blob/${encodePathSegments(branch)}/${encodePathSegments(cleanPath)}${suffix}`
}

function resolveReadmeImage(src: string | undefined, project: ProjectType) {
  if (!src || isExternalReference(src)) return src

  const { path, suffix } = splitReference(src)
  const cleanPath = cleanRepoPath(path)
  if (!cleanPath) return src

  const branch = project.default_branch || 'main'
  return `https://raw.githubusercontent.com/${project.repo}/${encodePathSegments(branch)}/${encodePathSegments(cleanPath)}${suffix}`
}

function getYouTubeEmbedUrl(value: string | undefined) {
  if (!value) return null

  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (host !== 'youtube.com' && host !== 'youtube-nocookie.com') return null

    const list = url.searchParams.get('list')
    if (url.pathname === '/playlist' && list) {
      return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(list)}`
    }

    if (url.pathname.startsWith('/embed/videoseries') && list) {
      return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(list)}`
    }

    if (url.pathname.startsWith('/embed/')) {
      const id = url.pathname.split('/').filter(Boolean)[1]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    const videoId = url.searchParams.get('v')
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  } catch {
    return null
  }
}

function ReadmeYouTubeEmbed({ src, title }: { src: string; title: string }) {
  return (
    <span className="project-readme-video">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </span>
  )
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

function ReadmeTaskCheckbox({
  checked,
  className,
  ...props
}: ComponentPropsWithoutRef<'input'>) {
  const [isChecked, setIsChecked] = useState(Boolean(checked))
  const inputProps = { ...props }
  delete inputProps.disabled
  delete inputProps.readOnly

  if (inputProps.type !== 'checkbox') {
    return <input {...inputProps} className={className} />
  }

  return (
    <input
      {...inputProps}
      type="checkbox"
      className={['project-readme-task-checkbox', className].filter(Boolean).join(' ')}
      checked={isChecked}
      disabled={false}
      onChange={(event) => setIsChecked(event.currentTarget.checked)}
    />
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

  const rankingCrown = project.ranking ? rankingCrowns[project.ranking] : null

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
            className="project-back-link"
          >
            ← Back to Gallery
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
            <div className="project-meta-title-strike">
              <p
                className="project-meta-title"
              >
                {project.year} <span className="text-[#8A8178]">&middot;</span> {project.section}{' '}
                <span className="text-[#8A8178]">&middot;</span> Group {project.group}
              </p>
            </div>
            {rankingCrown && (
              <p className="project-rank-line">
                <img src={rankingCrown} alt="" aria-hidden="true" />
                <span>Ranked #{project.ranking} in competition</span>
              </p>
            )}
          </div>

          <div className="project-meta-actions">
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

          <div className="project-meta-detail">
            <p className="project-meta-label">
              Authors
            </p>
            <p className="project-meta-value project-meta-value-muted">
              {project.authors.join(', ')}
            </p>
          </div>

          <div className="project-meta-detail md:text-right">
            <p className="project-meta-label">
              Keywords
            </p>
            {project.keywords.length > 0 ? (
              <div className="flex flex-wrap gap-1 md:justify-end">
                {project.keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="text-xs bg-[#D6CFC6] text-[#5A5651] border-0 rounded-full px-2 py-0.5"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="project-meta-value project-meta-value-muted">None</p>
            )}
          </div>
        </div>

        {/* README */}
        {project.readme && (
          <article className="markdown-body project-readme-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: ReadmeCodeBlock,
                input: ReadmeTaskCheckbox,
                a({ href, children }) {
                  const embedUrl = getYouTubeEmbedUrl(href)
                  if (embedUrl) {
                    return (
                      <ReadmeYouTubeEmbed
                        src={embedUrl}
                        title={getTextContent(children) || 'YouTube video'}
                      />
                    )
                  }

                  const resolvedHref = resolveReadmeLink(href, project)
                  const isAnchor = href?.startsWith('#')

                  return (
                    <a
                      href={resolvedHref}
                      target={isAnchor ? undefined : '_blank'}
                      rel={isAnchor ? undefined : 'noreferrer'}
                    >
                      {children}
                    </a>
                  )
                },
                img({ src, alt }) {
                  return (
                    <img
                      src={resolveReadmeImage(src, project)}
                      alt={alt || ''}
                      loading="lazy"
                    />
                  )
                },
              }}
            >
              {normalizeReadmeMarkdown(project.readme)}
            </ReactMarkdown>
          </article>
        )}
      </div>

      <Footer />
    </div>
  )
}
