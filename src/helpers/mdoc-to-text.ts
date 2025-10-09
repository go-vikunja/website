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
  // Remove Markdoc tags ({% %}) before parsing
  const cleanedMdoc = mdoc.replace(/\{%[\s\S]*?%\}/g, '')

  const processor = unified()
    .use(remarkParse) // Parse markdown to AST

  const ast = processor.parse(cleanedMdoc)

  const hast = await unified()
    .use(remarkRehype)
    .run(ast)

  const text = toText(hast)

  return { text, ast }
}
