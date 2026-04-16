import {defineCollection, z} from 'astro:content'

const docsCollection = defineCollection({
	type: 'content', // v2.5.0 and later
	schema: z.object({
		title: z.string(),
		description: z.string(),
		hideInMenu: z.boolean().optional(),
	}),
})

const helpCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		hideInMenu: z.boolean().optional(),
		sortOrder: z.number().optional(),
	}),
})

const changelogCollection = defineCollection({
	type: 'content',
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
