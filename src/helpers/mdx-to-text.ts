import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { toText } from 'hast-util-to-text'
import type { Node } from 'unist'

/**
 * Converts MDX content to plain text for search indexing
 * Strips all MDX imports, JSX tags, and formatting
 */
export async function mdxToPlainText(mdx: string): Promise<{ text: string; ast: Node }> {
  // Remove import statements
  const withoutImports = mdx.replace(/^import\s+.*$/gm, '')
  // Remove self-closing JSX tags: <Component />
  const withoutSelfClosing = withoutImports.replace(/<\w+[^>]*\/>/g, '')
  // Remove opening and closing JSX tags: <Component ...> and </Component>
  const cleaned = withoutSelfClosing.replace(/<\/?\w+[^>]*>/g, '')

  const processor = unified()
    .use(remarkParse)

  const ast = processor.parse(cleaned)

  const hast = await unified()
    .use(remarkRehype)
    .run(ast)

  const text = toText(hast)

  return { text, ast }
}
