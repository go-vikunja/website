import {mastodonConfig} from '../config.js'

export async function postToMastodon(text) {
	if (!mastodonConfig.token) {
		console.log('Skipping Mastodon: MASTODON_TOKEN not set')
		return null
	}

	const response = await fetch(`${mastodonConfig.baseUrl}/api/v1/statuses`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${mastodonConfig.token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({status: text}),
	})

	if (!response.ok) {
		const body = await response.text()
		throw new Error(`Mastodon API error ${response.status}: ${body}`)
	}

	const data = await response.json()
	return data.url
}
