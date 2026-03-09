import { getCollection } from 'astro:content'
import { mdxToPlainText } from '../../helpers/mdx-to-text'
import { extractHeadings } from '../../helpers/extract-headings'

export interface SearchIndexItem {
  slug: string
  title: string
  description: string
  headings: string[]
  body: string
}

async function buildIndex(collection: 'docs' | 'help', prefix: string): Promise<SearchIndexItem[]> {
  const entries = await getCollection(collection)

  return Promise.all(
    entries.map(async (entry) => {
      const { text, ast } = await mdxToPlainText(entry.body || '')
      const headings = extractHeadings(ast)

      return {
        slug: `${prefix}${entry.slug}`,
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
    buildIndex('docs', '/docs/'),
    buildIndex('help', '/help/'),
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
