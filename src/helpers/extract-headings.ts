import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import type { Node } from 'unist'

/**
 * Extracts all headings from markdown AST
 * Returns array of heading text for search boosting
 */
export function extractHeadings(ast: Node): string[] {
  const headings: string[] = []

  visit(ast, 'heading', (node: any) => {
    const text = toString(node)
    if (text.trim()) {
      headings.push(text.trim())
    }
  })

  return headings
}
