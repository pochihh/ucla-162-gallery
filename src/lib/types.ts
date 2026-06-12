export interface Project {
  repo: string
  repo_url: string
  stars: number
  featured: boolean
  slug: string
  schema_version: 1
  course: 'MAE 162D/E'
  year: number
  section: string
  group: number
  title: string
  authors: string[]
  summary: string
  thumbnail: string
  thumbnail_repo_path: string
  keywords: string[]
  manifest: string
  readme: string
  updated_at: string
}
