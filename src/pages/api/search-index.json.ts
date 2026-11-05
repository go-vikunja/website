import { type CollectionEntry, getCollection } from 'astro:content'
import { getEntries } from '../../i18n/content'
import { mdxToPlainText } from '../../helpers/mdx-to-text'
import { extractHeadings } from '../../helpers/extract-headings'

export interface SearchIndexItem {
  slug: string
  title: string
  description: string
  headings: string[]
  body: string
}

async function buildIndex(
  entries: { slug: string, entry: CollectionEntry<'docs' | 'help'> }[],
  prefix: string,
): Promise<SearchIndexItem[]> {
  return Promise.all(
    entries.map(async ({ slug, entry }) => {
      const { text, ast } = await mdxToPlainText(entry.body || '')
      const headings = extractHeadings(ast)

      return {
        slug: `${prefix}${slug}`,
        title: entry.data.title,
        description: entry.data.description || '',
        headings,
        body: text,
      }
    })
  )
}

export async function GET() {
  const [docsIndex, helpIndex] = await Promise.all([
    getCollection('docs').then(docs => buildIndex(docs.map(entry => ({ slug: entry.id, entry })), '/docs/')),
    getEntries('help', 'en').then(help => buildIndex(help, '/help/')),
  ])

  const index = [...docsIndex, ...helpIndex]

  return new Response(
    JSON.stringify(index),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
