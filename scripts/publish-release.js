#!/usr/bin/env node

import {existsSync} from 'node:fs'
import {join, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createInterface} from 'node:readline'

import {generateAndEdit} from './publish-release/generate.js'
import {postToMastodon} from './publish-release/platforms/mastodon.js'
import {postToBluesky} from './publish-release/platforms/bluesky.js'
import {postToGithub} from './publish-release/platforms/github.js'
import {postToDiscourse} from './publish-release/platforms/discourse.js'
import {postToMatrix} from './publish-release/platforms/matrix.js'
import {postToLinkedin} from './publish-release/platforms/linkedin.js'
import {postToListmonk} from './publish-release/platforms/listmonk.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

async function confirm(question) {
	const rl = createInterface({input: process.stdin, output: process.stdout})
	return new Promise(resolve => {
		rl.question(`${question} [Y/n] `, answer => {
			rl.close()
			resolve(answer.toLowerCase() !== 'n')
		})
	})
}

async function main() {
	const args = process.argv.slice(2)
	const dryRun = args.includes('--dry-run')
	const version = args.find(a => !a.startsWith('--'))

	if (!version) {
		console.error('Usage: node scripts/publish-release.js <version> [--dry-run]')
		console.error('Example: node scripts/publish-release.js 2.1.0 --dry-run')
		process.exit(1)
	}

	if (dryRun) {
		console.log('[DRY RUN] No actual posts will be made.\n')
	}

	// 1. Find blog post
	const blogPostPath = join(rootDir, 'src', 'content', 'changelog', `release-${version}.mdx`)
	if (!existsSync(blogPostPath)) {
		console.error(`Blog post not found: ${blogPostPath}`)
		process.exit(1)
	}
	console.log(`Found blog post: ${blogPostPath}`)

	// 2. Generate content variants
	const {short, linkedin, newsletter} = await generateAndEdit(blogPostPath, version)

	// 3. Post to each platform
	const results = []

	const platforms = [
		{
			name: 'Mastodon',
			content: short,
			fn: () => postToMastodon(short),
		},
		{
			name: 'Bluesky',
			content: short,
			fn: () => postToBluesky(short),
		},
		{
			name: 'GitHub Release',
			content: short,
			fn: () => postToGithub(short, version),
		},
		{
			name: 'Discourse',
			content: short,
			fn: () => postToDiscourse(short, version),
		},
		{
			name: 'Matrix',
			content: short,
			fn: () => postToMatrix(short),
		},
		{
			name: 'LinkedIn',
			content: linkedin,
			fn: () => postToLinkedin(linkedin),
		},
		{
			name: 'Listmonk',
			content: newsletter.slice(0, 200) + '...',
			fn: () => postToListmonk(newsletter, version),
		},
	]

	for (const platform of platforms) {
		if (dryRun) {
			console.log(`--- ${platform.name} ---`)
			console.log(platform.content)
			console.log()
			results.push({name: platform.name, url: 'dry-run'})
			continue
		}

		const shouldPost = await confirm(`Post to ${platform.name}?`)
		if (!shouldPost) {
			console.log(`Skipped ${platform.name}`)
			results.push({name: platform.name, url: 'skipped'})
			continue
		}

		try {
			const url = await platform.fn()
			if (url) {
				console.log(`${platform.name}: ${url}`)
				results.push({name: platform.name, url})
			} else {
				results.push({name: platform.name, url: 'skipped (not configured)'})
			}
		} catch (error) {
			console.error(`${platform.name} failed: ${error.message}`)
			results.push({name: platform.name, url: `FAILED: ${error.message}`})
		}
	}

	// 4. Summary
	console.log('\n🚀 Summary')
	for (const {name, url} of results) {
		let icon
		if (url === 'skipped' || url === 'skipped (not configured)') {
			icon = '⏭️'
		} else if (url === 'dry-run') {
			icon = '🧪'
		} else if (url.startsWith('FAILED')) {
			icon = '❌'
		} else {
			icon = '✅'
		}
		console.log(`  ${icon} ${name}: ${url}`)
	}
}

main().catch(error => {
	console.error(error)
	process.exit(1)
})
