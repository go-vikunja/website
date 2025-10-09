import { getCollection } from 'astro:content'
import { mdocToPlainText } from '../../helpers/mdoc-to-text'
import { extractHeadings } from '../../helpers/extract-headings'

export interface SearchIndexItem {
  slug: string
  title: string
  description: string
  headings: string[]
  body: string
}

export async function GET() {
  const docs = await getCollection('docs')

  const index: SearchIndexItem[] = await Promise.all(
    docs.map(async (doc) => {
      // Parse mdoc body to plain text
      const { text, ast } = await mdocToPlainText(doc.body || '')

      // Extract headings for boosting
      const headings = extractHeadings(ast)

      return {
        slug: `/docs/${doc.slug}`,
        title: doc.data.title,
        description: doc.data.description || '',
        headings,
        body: text,
      }
    })
  )

  return new Response(
    JSON.stringify(index),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
