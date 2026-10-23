import {getCollection} from 'astro:content'

export interface OgPage {
	title: string
	description?: string
}

export const OG_DEFAULT_ROUTE = 'default'

// .astro pages have no frontmatter to glob, keep in sync with their <Layout> props.
const astroPages: Record<string, OgPage> = {
	[OG_DEFAULT_ROUTE]: {
		title: 'Vikunja',
		description: 'The open-source, self-hostable task manager.',
	},
	'index': {
		title: 'The task manager you actually own',
		description: 'Open-source task management you can self-host. Lists, Kanban, Gantt, and more — on your server or ours.',
	},
	'features': {title: 'Features', description: 'Stay organized, collaborate, and customize your workflow with multiple views.'},
	'pricing': {title: 'Pricing', description: 'Self-host for free or let us run it for you.'},
	'pro': {title: 'Vikunja Pro', description: 'Audit logs, admin panel, time tracking for self-hosted Vikunja.'},
	'install': {title: 'Install Vikunja Server', description: 'Get the Vikunja server up and running in minutes.'},
	'convince': {title: 'Convince Your Boss', description: 'Everything you need to bring Vikunja to your team at work.'},
	'changelog': {title: 'Changelog', description: 'The latest on Vikunja\'s product development and releases.'},
	'compare/notion': {title: 'Vikunja vs Notion'},
	'compare/planka': {title: 'Vikunja vs Planka'},
	'compare/todoist': {title: 'Vikunja vs Todoist'},
	'compare/trello': {title: 'Vikunja vs Trello'},
	'compare/wekan': {title: 'Vikunja vs WeKan'},
}

const markdownPages = import.meta.glob<{frontmatter: OgPage}>('/src/pages/**/*.{md,mdx}', {eager: true})

export async function getOgPages(): Promise<Record<string, OgPage>> {
	const pages: Record<string, OgPage> = {...astroPages}

	for (const [path, page] of Object.entries(markdownPages)) {
		const route = path.replace('/src/pages/', '').replace(/\.mdx?$/, '')
		pages[route] = {title: page.frontmatter.title, description: page.frontmatter.description}
	}

	for (const collection of ['docs', 'help', 'changelog'] as const) {
		for (const entry of await getCollection(collection)) {
			pages[`${collection}/${entry.id.replace(/^\/|\/$/g, '')}`] = entry.data
		}
	}

	return pages
}

export function pathnameToOgRoute(pathname: string): string {
	return pathname.replace(/^\/|\/$/g, '') || 'index'
}
