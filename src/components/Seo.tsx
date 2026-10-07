import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { getBlogPost } from '../data/blog'
import {
  absoluteUrl,
  breadcrumbJsonLd,
  defaultOgImage,
  localBusinessJsonLd,
  resolvePageSeo,
  websiteJsonLd,
} from '../data/seo'
import { faqs, site } from '../data/site'
import { useBlogPosts } from '../lib/blogFeed'

export function Seo() {
  const { pathname } = useLocation()
  // Blog posts written in Image Manager Pro are not in the fixed list: look them up at runtime.
  const blogSlug = /^\/blog\/[^/]+\/?$/.test(pathname) ? pathname.replace(/^\/blog\//, '').replace(/\/$/, '') : ''
  const isManagerPost = Boolean(blogSlug) && !getBlogPost(blogSlug)
  const { posts } = useBlogPosts(isManagerPost)
  const managerPost = isManagerPost ? posts.find((post) => post.slug === blogSlug) : undefined
  const seo = managerPost
    ? {
        path: `/blog/${managerPost.slug}`,
        title: `${managerPost.title} | Blog ZB Interieur Homburg`,
        description: managerPost.excerpt,
        keywords: [managerPost.category, 'Blog ZB Interieur', 'Einrichtungshaus Homburg'],
        ogImage: absoluteUrl(managerPost.image),
        type: 'article' as const,
      }
    : resolvePageSeo(pathname)
  const url = absoluteUrl(seo.path)
  const image = seo.ogImage || defaultOgImage
  const robots = seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

  const graph: Record<string, unknown>[] = [
    localBusinessJsonLd(),
    websiteJsonLd(),
    breadcrumbJsonLd(seo.path, seo.title),
  ]

  if (seo.path === '/') {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    })
  }

  if (seo.path.startsWith('/blog/') && seo.path !== '/blog') {
    const post = getBlogPost(seo.path.slice('/blog/'.length)) || managerPost
    if (post) {
      graph.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: absoluteUrl(post.image),
        datePublished: post.date,
        author: {
          '@type': 'Organization',
          name: site.name,
        },
        publisher: {
          '@type': 'Organization',
          name: site.name,
          logo: absoluteUrl('/images/logo.jpg'),
        },
        mainEntityOfPage: url,
      })
    }
  }

  return (
    <Helmet prioritizeSeoTags>
      <html lang="de" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="author" content={site.legalName} />
      <meta name="geo.region" content="DE-SL" />
      <meta name="geo.placename" content="Homburg" />
      <meta name="geo.position" content="49.3299891;7.3465506" />
      <meta name="ICBM" content="49.3299891, 7.3465506" />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={seo.type || 'website'} />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={seo.title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">{`
        ${JSON.stringify(graph)}
      `}</script>
    </Helmet>
  )
}
