import {join, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
try {
	process.loadEnvFile(join(__dirname, '..', '..', '.env'))
} catch {
	// .env file is optional — credentials may come from the environment
}

export const mastodonConfig = {
	baseUrl: 'https://social.linux.pizza',
	token: process.env.MASTODON_TOKEN,
}

export const blueskyConfig = {
	handle: process.env.BLUESKY_HANDLE,
	appPassword: process.env.BLUESKY_APP_PASSWORD,
}

export const discourseConfig = {
	baseUrl: 'https://community.vikunja.io',
	apiKey: process.env.DISCOURSE_API_KEY,
	username: process.env.DISCOURSE_USERNAME,
}

export const matrixConfig = {
	homeserver: process.env.MATRIX_HOMESERVER || 'https://matrix.org',
	accessToken: process.env.MATRIX_ACCESS_TOKEN,
	roomId: process.env.MATRIX_ROOM_ID,
}

export const listmonkConfig = {
	url: process.env.LISTMONK_URL,
	apiUser: process.env.LISTMONK_API_USER,
	apiPassword: process.env.LISTMONK_API_PASSWORD,
	listId: process.env.LISTMONK_LIST_ID ? Number(process.env.LISTMONK_LIST_ID) : undefined,
}

export const githubRepo = 'go-vikunja/vikunja'
