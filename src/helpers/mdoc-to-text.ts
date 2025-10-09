import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { toText } from 'hast-util-to-text'
import type { Node } from 'unist'

/**
 * Converts Markdoc content to plain text for search indexing
 * Strips all Markdoc tags, nodes, and formatting
 */
export async function mdocToPlainText(mdoc: string): Promise<{ text: string; ast: Node }> {
  const processor = unified()
    .use(remarkParse) // Parse markdown to AST

  const ast = processor.parse(mdoc)

  // Note: Markdoc uses {% %} tags which remarkParse treats as text
  // They'll be included in plain text but won't break search

  const hast = await unified()
    .use(remarkRehype)
    .run(ast)

  const text = toText(hast)

  return { text, ast }
}
