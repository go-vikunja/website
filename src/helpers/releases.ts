import {getCollection} from 'astro:content'

const VERSION = /^\d+\.\d+\.\d+$/
const RELEASE_FILE = /release-(\d+\.\d+\.\d+)\.mdx$/

function compareVersions(a: string, b: string): number {
	const [pa, pb] = [a, b].map(v => v.split('.').map(Number))
	for (let i = 0; i < 3; i++) {
		if (pa[i] !== pb[i]) {
			return pa[i] - pb[i]
		}
	}
	return 0
}

let latest: Promise<string> | undefined

// Publishing a release post flips every notice for its version.
export function getLatestRelease(): Promise<string> {
	latest ??= getCollection('changelog').then(entries => entries
		.map(e => e.filePath?.match(RELEASE_FILE)?.[1])
		.filter((v): v is string => v !== undefined)
		.reduce((a, b) => compareVersions(a, b) >= 0 ? a : b))
	return latest
}

export async function isReleased(version: string): Promise<boolean> {
	if (!VERSION.test(version)) {
		throw new Error(`Invalid version "${version}", expected x.y.z`)
	}
	return compareVersions(await getLatestRelease(), version) >= 0
}
