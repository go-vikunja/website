const API = 'https://my.vikunja.cloud/api/v2'
const PROJECT_ID = 210
const VIEW_ID = 645
const SHIPPED_DAYS = 90
const PUBLIC_LABEL = 'public'
const LINK_PATTERN = /https:\/\/(?:github\.com\/go-vikunja|community\.vikunja\.io)\/[^\s"'<>]+/
const SUMMARY_PREFIX = /^public:\s*/i

interface ApiTask {
	title: string
	description: string
	done: boolean
	done_at: string
	position: number
	labels: {title: string}[] | null
}

interface ApiBucket {
	title: string
	position: number
	tasks: ApiTask[] | null
}

export interface RoadmapItem {
	title: string
	pro: boolean
	summary?: string
	link?: string
}

export interface RoadmapColumn {
	title: string
	items: RoadmapItem[]
}

const ENTITIES: Record<string, string> = {amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' '}

// Only the description's first line is public, and only if it starts with "Public:".
export function publicSummary(description: string | undefined): string | undefined {
	const firstLine = (description ?? '')
		.replace(/<\/(p|h\d|li|div)>|<br\s*\/?>/gi, '\n')
		.replace(/<[^>]+>/g, '')
		.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, e) => ENTITIES[e])
		.split('\n')
		.map(l => l.trim())
		.find(l => l !== '')
	if (!firstLine || !SUMMARY_PREFIX.test(firstLine)) {
		return undefined
	}
	return firstLine.replace(SUMMARY_PREFIX, '') || undefined
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
	const res = await fetch(`${API}${path}`, init)
	if (!res.ok) {
		throw new Error(`Roadmap: ${init.method ?? 'GET'} ${path} returned ${res.status}`)
	}
	return res.json()
}

// The link share is scoped to the roadmap project, unlike a personal API token.
export async function fetchRoadmap(): Promise<RoadmapColumn[]> {
	// Not astro:env: that validates every server secret at build, e.g. TURNSTILE_SECRET.
	const {ROADMAP_SHARE_HASH} = import.meta.env
	if (!ROADMAP_SHARE_HASH) {
		console.warn('ROADMAP_SHARE_HASH is not set, rendering an empty roadmap')
		return []
	}

	const {token} = await api<{token: string}>(`/shares/${ROADMAP_SHARE_HASH}/auth`, {method: 'POST'})
	const {items: buckets} = await api<{items: ApiBucket[]}>(
		`/projects/${PROJECT_ID}/views/${VIEW_ID}/buckets/tasks`,
		{headers: {Authorization: `Bearer ${token}`}},
	)

	const shippedSince = new Date(Date.now() - SHIPPED_DAYS * 86_400_000).toISOString()
	let hidden = 0

	const columns = buckets
		.toSorted((a, b) => a.position - b.position)
		.map(bucket => {
			const tasks = (bucket.tasks ?? [])
				.filter(t => !t.done || t.done_at >= shippedSince)
				.toSorted((a, b) => a.position - b.position)
			const visible = tasks.filter(t => t.labels?.some(l => l.title === PUBLIC_LABEL))
			hidden += tasks.length - visible.length

			return {
				title: bucket.title,
				// Descriptions hold internal notes, so only the summary and a link are taken from them.
				items: visible.map(t => ({
					title: t.title,
					pro: t.labels?.some(l => l.title === 'pro') ?? false,
					summary: publicSummary(t.description),
					link: t.description?.match(LINK_PATTERN)?.[0],
				})),
			}
		})

	console.info(`Roadmap: ${hidden} cards hidden without the "${PUBLIC_LABEL}" label`)

	return columns
}
