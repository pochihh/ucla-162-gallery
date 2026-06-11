export interface Contributor {
  login: string
  avatar_url: string
  html_url: string
}

export interface Project {
  repo: string        // full "owner/name"
  slug: string        // just the repo name, used as route key
  title: string
  authors: string[]
  thumbnail: string   // absolute URL to raw.githubusercontent.com
  keywords: string[]
  summary: string
  demo_url?: string
  video_url?: string
  stars: number
  contributors: Contributor[]
  readme: string      // raw markdown
  updated_at: string  // ISO date string
}
