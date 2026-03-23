import {blueskyConfig} from '../config.js'

const BSKY_API = 'https://bsky.social/xrpc'

async function createSession() {
	const response = await fetch(`${BSKY_API}/com.atproto.server.createSession`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			identifier: blueskyConfig.handle,
			password: blueskyConfig.appPassword,
		}),
	})

	if (!response.ok) {
		const body = await response.text()
		throw new Error(`Bluesky login failed ${response.status}: ${body}`)
	}

	return response.json()
}

/** Detect URLs in text and create facets (rich text link annotations). */
function detectFacets(text) {
	const urlRegex = /https?:\/\/[^\s)]+/g
	const facets = []
	let match

	while ((match = urlRegex.exec(text)) !== null) {
		const url = match[0]
		const byteStart = Buffer.byteLength(text.slice(0, match.index), 'utf-8')
		const byteEnd = byteStart + Buffer.byteLength(url, 'utf-8')

		facets.push({
			index: {byteStart, byteEnd},
			features: [{
				$type: 'app.bsky.richtext.facet#link',
				uri: url,
			}],
		})
	}

	return facets
}

export async function postToBluesky(text) {
	if (!blueskyConfig.handle || !blueskyConfig.appPassword) {
		console.log('Skipping Bluesky: BLUESKY_HANDLE or BLUESKY_APP_PASSWORD not set')
		return null
	}

	const session = await createSession()
	const facets = detectFacets(text)

	const record = {
		$type: 'app.bsky.feed.post',
		text,
		facets,
		createdAt: new Date().toISOString(),
	}

	const response = await fetch(`${BSKY_API}/com.atproto.repo.createRecord`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${session.accessJwt}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			repo: session.did,
			collection: 'app.bsky.feed.post',
			record,
		}),
	})

	if (!response.ok) {
		const body = await response.text()
		throw new Error(`Bluesky post failed ${response.status}: ${body}`)
	}

	const data = await response.json()
	// Construct the web URL from the AT URI
	const rkey = data.uri.split('/').pop()
	return `https://bsky.app/profile/${session.handle}/post/${rkey}`
}
