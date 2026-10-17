import { type CollectionEntry, getCollection } from 'astro:content'
import { mdxToPlainText } from './mdx-to-text'
import { extractHeadings } from './extract-headings'
import { getEntriesWithFallback } from '../i18n/content'
import type { Locale } from '../i18n/locales'
import { localizedHref } from '../i18n/routes'

export interface SearchIndexItem {
  slug: string
  title: string
  description: string
  headings: string[]
  body: string
}

async function buildItems(
  entries: { url: string, entry: CollectionEntry<'docs' | 'help'> }[],
): Promise<SearchIndexItem[]> {
  return Promise.all(
    entries.map(async ({ url, entry }) => {
      const { text, ast } = await mdxToPlainText(entry.body || '')

      return {
        slug: url,
        title: entry.data.title,
        description: entry.data.description || '',
        headings: extractHeadings(ast),
        body: text,
      }
    })
  )
}

/** Docs stay English; help pages use the translation where one exists. */
export async function buildSearchIndex(locale: Locale): Promise<SearchIndexItem[]> {
  const [docs, help] = await Promise.all([
    getCollection('docs'),
    getEntriesWithFallback('help', locale),
  ])

  return [
    ...await buildItems(docs.map(entry => ({ url: `/docs/${entry.id}`, entry }))),
    ...await buildItems(help.map(({ slug, entry }) => ({ url: localizedHref(locale, `/help/${slug}`), entry }))),
  ]
}

export function searchIndexResponse(index: SearchIndexItem[]): Response {
  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
