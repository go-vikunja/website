import {listmonkConfig} from '../config.js'

export function postToListmonk(htmlContent, version, title) {
	return createDraftCampaign(htmlContent, title, listmonkConfig.listIds, 'LISTMONK_LIST_IDS')
}

export function postToListmonkSecurityList(htmlContent, title) {
	return createDraftCampaign(htmlContent, title, listmonkConfig.securityListIds, 'LISTMONK_SECURITY_LIST_ID')
}

async function createDraftCampaign(htmlContent, title, listIds, listIdsEnvName) {
	if (!listmonkConfig.url || !listmonkConfig.apiUser || !listmonkConfig.apiToken) {
		console.log('Skipping Listmonk: LISTMONK_URL, LISTMONK_API_USER, or LISTMONK_API_TOKEN not set')
		return null
	}

	if (listIds.length === 0) {
		console.log(`Skipping Listmonk: ${listIdsEnvName} not set`)
		return null
	}

	const response = await fetch(`${listmonkConfig.url}/api/campaigns`, {
		method: 'POST',
		headers: {
			'Authorization': `token ${listmonkConfig.apiUser}:${listmonkConfig.apiToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name: title,
			subject: title,
			lists: listIds,
			type: 'regular',
			content_type: 'html',
			body: htmlContent,
		}),
	})

	if (!response.ok) {
		const body = await response.text()
		throw new Error(`Listmonk API error ${response.status}: ${body}`)
	}

	const data = await response.json()
	const campaignId = data.data.id
	return `${listmonkConfig.url}/campaigns/${campaignId}`
}
