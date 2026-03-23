import {matrixConfig} from '../config.js'

export async function postToMatrix(text) {
	if (!matrixConfig.accessToken || !matrixConfig.roomId) {
		console.log('Skipping Matrix: MATRIX_ACCESS_TOKEN or MATRIX_ROOM_ID not set')
		return null
	}

	const txnId = `vikunja-release-${Date.now()}`
	const encodedRoomId = encodeURIComponent(matrixConfig.roomId)
	const url = `${matrixConfig.homeserver}/_matrix/client/v3/rooms/${encodedRoomId}/send/m.room.message/${txnId}`

	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${matrixConfig.accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			msgtype: 'm.text',
			body: '@room ' + text,
			format: 'org.matrix.custom.html',
			formatted_body: text.replace(/\n/g, '<br>'),
		}),
	})

	if (!response.ok) {
		const body = await response.text()
		throw new Error(`Matrix API error ${response.status}: ${body}`)
	}

	return 'sent'
}
