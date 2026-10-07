/** ZB website: blog posts written in Image Manager Pro, merged with the fixed posts in code. */

import { useEffect, useState } from 'react'
import { blogPosts, type BlogPost } from '../data/blog'
import { ZB_GALLERY_ID } from './imageManagerFeed'

type ManagerPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  image_url: string | null
  image_alt: string
  body: string
  published_at: string | null
}

const dateLabel = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })

function toBlogPost(post: ManagerPost): BlogPost {
  const date = post.published_at ? new Date(post.published_at) : new Date()
  const body = post.body.split(/\r?\n+/).map((line) => line.trim()).filter(Boolean)
  const words = body.join(' ').split(/\s+/).filter(Boolean).length
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || body[0] || '',
    date: date.toISOString().slice(0, 10),
    dateLabel: dateLabel.format(date),
    category: post.category || 'Blog',
    image: post.image_url || '/images/blog/einrichtungsplanung.jpg',
    imageAlt: post.image_alt || post.title,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    body,
  }
}

let cache: Promise<BlogPost[]> | null = null

function loadManagerPosts(): Promise<BlogPost[]> {
  if (!cache) {
    cache = fetch(`/.netlify/functions/public-blog?id=${ZB_GALLERY_ID}`)
      .then((response) => (response.ok ? response.json() : { posts: [] }))
      .then((body: { posts?: ManagerPost[] }) => (body.posts || []).map(toBlogPost))
      .catch(() => [])
  }
  return cache
}

/**
 * All posts, newest first. `loaded` turns true once the Image Manager posts arrived.
 * With enabled=false nothing is fetched (used by the site-wide Seo component).
 */
export function useBlogPosts(enabled = true): { posts: BlogPost[]; loaded: boolean } {
  const [managerPosts, setManagerPosts] = useState<BlogPost[] | null>(null)
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    void loadManagerPosts().then((posts) => { if (!cancelled) setManagerPosts(posts) })
    return () => { cancelled = true }
  }, [enabled])
  const extra = managerPosts || []
  const slugs = new Set(extra.map((post) => post.slug))
  const posts = [...extra, ...blogPosts.filter((post) => !slugs.has(post.slug))]
    .sort((a, b) => b.date.localeCompare(a.date))
  return { posts, loaded: managerPosts !== null }
}
