import {spawnSync} from 'node:child_process'
import {githubRepo} from '../config.js'

export async function postToGithub(text, version) {
	const tag = `v${version}`

	// Check if release exists
	const checkResult = spawnSync('gh', ['release', 'view', tag, '--repo', githubRepo], {
		encoding: 'utf-8',
		stdio: ['pipe', 'pipe', 'pipe'],
	})

	if (checkResult.status !== 0) {
		console.log(`Skipping GitHub: No release found for tag ${tag}`)
		return null
	}

	// Update release notes
	const editResult = spawnSync('gh', [
		'release', 'edit', tag,
		'--repo', githubRepo,
		'--notes', text,
	], {
		encoding: 'utf-8',
		stdio: ['pipe', 'pipe', 'inherit'],
	})

	if (editResult.status !== 0) {
		throw new Error(`Failed to update GitHub release notes`)
	}

	// Publish draft release
	const publishResult = spawnSync('gh', [
		'release', 'edit', tag,
		'--repo', githubRepo,
		'--draft=false',
	], {
		encoding: 'utf-8',
		stdio: ['pipe', 'pipe', 'inherit'],
	})

	if (publishResult.status !== 0) {
		throw new Error(`Failed to publish GitHub release`)
	}

	return `https://github.com/${githubRepo}/releases/tag/${tag}`
}
