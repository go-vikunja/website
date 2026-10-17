import {globSync, readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import type {Node} from 'unist'
import {visit} from 'unist-util-visit'
import {defaultLocale, toLocale} from './locales'
import {collectTranslatedPaths, localizeHref} from './translated-paths'

interface Element extends Node {
	tagName: string
	properties: Record<string, unknown>
}

/** Points internal links in translated content to the translated page, where one exists. */
export function rehypeLocalizeLinks() {
	const pagesDir = fileURLToPath(new URL('../pages', import.meta.url))
	const contentDir = fileURLToPath(new URL('../content', import.meta.url))
	const translated = collectTranslatedPaths(
		globSync('*/**/*.{astro,md,mdx}', {cwd: pagesDir}),
		Object.fromEntries(globSync('{help,pages}/*/**/[^_]*.{md,mdx}', {cwd: contentDir})
			.filter(f => f.split('/')[1] !== defaultLocale)
			.map(f => [f, readFileSync(`${contentDir}/${f}`, 'utf8')])),
	)

	return (tree: Node, file: {path?: string}) => {
		const folder = file.path?.match(/\/src\/content\/[^/]+\/([^/]+)\//)?.[1]
		const locale = toLocale(folder)
		if (locale === defaultLocale || locale !== folder) {
			return
		}
		visit(tree, 'element', (node: Element) => {
			const href = node.properties.href
			if (node.tagName === 'a' && typeof href === 'string' && href.startsWith('/')) {
				node.properties.href = localizeHref(translated, locale, href)
			}
		})
	}
}
