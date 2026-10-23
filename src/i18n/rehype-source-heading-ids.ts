import {readFileSync} from 'node:fs'
import rehypeSlug from 'rehype-slug'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'
import type {Node} from 'unist'
import {visit} from 'unist-util-visit'
import {defaultLocale, toLocale} from './locales'

interface Element extends Node {
	tagName: string
	properties: Record<string, unknown>
}

const isHeading = (node: Element) => /^h[1-6]$/.test(node.tagName)

function headingIdsOf(markdown: string): string[] {
	const processor = unified().use(remarkParse).use(remarkRehype).use(rehypeSlug)
	const tree = processor.runSync(processor.parse(markdown.replace(/^---\n[\s\S]*?\n---\n/, '')))
	const ids: string[] = []
	visit(tree as Node, 'element', (node: Element) => {
		if (isHeading(node)) {
			ids.push(String(node.properties.id))
		}
	})
	return ids
}

/** Gives translated headings the ids of the English original, so #anchor links work in every locale. */
export function rehypeSourceHeadingIds() {
	return (tree: Node, file: {path?: string, message: (reason: string) => void}) => {
		const match = file.path?.match(/^(.*\/src\/content\/[^/]+\/)([^/]+)(\/.+)$/)
		if (!match || match[2] === defaultLocale || toLocale(match[2]) !== match[2]) {
			return
		}
		let source: string
		try {
			source = readFileSync(match[1] + defaultLocale + match[3], 'utf8')
		} catch {
			return
		}

		const ids = headingIdsOf(source)
		const headings: Element[] = []
		visit(tree, 'element', (node: Element) => {
			if (isHeading(node)) {
				headings.push(node)
			}
		})
		if (headings.length !== ids.length) {
			file.message(`Heading count differs from the English original (${headings.length} vs ${ids.length}), keeping translated ids`)
			return
		}
		headings.forEach((heading, i) => {
			heading.properties.id = ids[i]
		})
	}
}
