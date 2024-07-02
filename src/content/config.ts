import {defineCollection, z} from 'astro:content'

const docsCollection = defineCollection({
	type: 'content', // v2.5.0 and later
	schema: z.object({
		title: z.string(),
		hideInMenu: z.boolean().optional(),
	}),
})

const changelogCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		date: z.date(),
	}),
})

export const collections = {
	'docs': docsCollection,
	'changelog': changelogCollection,
}
