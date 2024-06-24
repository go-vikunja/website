import {defineCollection, z} from 'astro:content'

const docsCollection = defineCollection({
	type: 'content', // v2.5.0 and later
	schema: z.object({
		title: z.string(),
	}),
})

export const collections = {
	'docs': docsCollection,
}
