import {defineCollection} from 'astro:content'
import {glob} from 'astro/loaders'
import {z} from 'astro/zod'
import {generateLocalizedId, localizedContentPattern} from './i18n/content'

const docsCollection = defineCollection({
	loader: glob({pattern: '**/[^_]*.mdx', base: './src/content/docs'}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		hideInMenu: z.boolean().optional(),
	}),
})

const helpCollection = defineCollection({
	loader: glob({pattern: localizedContentPattern, base: './src/content/help', generateId: generateLocalizedId}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		hideInMenu: z.boolean().optional(),
		sortOrder: z.number().optional(),
	}),
})

const changelogCollection = defineCollection({
	loader: glob({pattern: '**/[^_]*.mdx', base: './src/content/changelog'}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.date(),
		isRelease: z.boolean().optional(),
	}),
})

export const collections = {
	'docs': docsCollection,
	'help': helpCollection,
	'changelog': changelogCollection,
}
