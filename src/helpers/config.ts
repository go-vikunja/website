export function generateConfigHeadingId(level: number, parent: string, key: string | undefined): string {
	return [
		level,
		parent,
		key,
	].join('-')
}

export interface ConfigItem {
	key?: string
	value?: string
	comment?: string
	default_value?: string
	children?: ConfigItem[]
}

interface ConfigHeadingEntry {
	slug: string
	depth: number
	text: string
}

export function generateConfigHeadings(data: ConfigItem, parentSlug: string = '', depth: number = 0): ConfigHeadingEntry[] {
	let result: ConfigHeadingEntry[] = []

	if (data.key) {
		const slug = generateConfigHeadingId(depth, parentSlug, data.key)
		result.push({
			slug,
			depth: depth + 2,
			text: data.key,
		})
	}

	if (data.children) {
		for (let i = 0; i < data.children.length; i++) {
			const child = data.children[i]
			const childSlug = data.key ? (parentSlug ? `${parentSlug}.${data.key}` : data.key) : `${parentSlug}[${i}]`
			result = result.concat(generateConfigHeadings(child, childSlug, depth + 1))
		}
	}

	return result
}

export async function fetchConfigItems(): Promise<ConfigItem> {
	const response = await fetch('https://raw.githubusercontent.com/go-vikunja/vikunja/main/config-raw.json')
	return await response.json()
}
