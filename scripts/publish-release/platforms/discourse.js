import {discourseConfig} from '../config.js'

export async function postToDiscourse(text, version) {
	if (!discourseConfig.apiKey || !discourseConfig.username) {
		console.log('Skipping Discourse: DISCOURSE_API_KEY or DISCOURSE_USERNAME not set')
		return null
	}

	// First, find the "release" category ID
	const categoriesResponse = await fetch(`${discourseConfig.baseUrl}/categories.json`, {
		headers: {
			'Api-Key': discourseConfig.apiKey,
			'Api-Username': discourseConfig.username,
		},
	})

	if (!categoriesResponse.ok) {
		throw new Error(`Discourse categories fetch failed: ${categoriesResponse.status}`)
	}

	const categoriesData = await categoriesResponse.json()
	const releaseCategory = categoriesData.category_list.categories.find(
		c => c.name.toLowerCase() === 'releases',
	)

	if (!releaseCategory) {
		throw new Error('Could not find "release" category on Discourse')
	}

	const response = await fetch(`${discourseConfig.baseUrl}/posts.json`, {
		method: 'POST',
		headers: {
			'Api-Key': discourseConfig.apiKey,
			'Api-Username': discourseConfig.username,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			title: `Vikunja ${version} was released`,
			raw: text,
			category: releaseCategory.id,
		}),
	})

	if (!response.ok) {
		const body = await response.text()
		throw new Error(`Discourse API error ${response.status}: ${body}`)
	}

	const data = await response.json()
	return `${discourseConfig.baseUrl}/t/${data.topic_slug}/${data.topic_id}`
}
