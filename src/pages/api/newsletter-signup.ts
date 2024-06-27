import {TURNSTILE_SECRET} from 'astro:env/server'

const LIST_ID = 'f0bc9ec2-56a4-48c8-baad-7a31b137484e'

interface FullRequestInput {
	request: Request
}

export async function POST({request}: FullRequestInput) {
	const body = await request.formData()

	// Turnstile injects a token in "cf-turnstile-response".
	const token = body.get('cf-turnstile-response')
	const ip = request.headers.get('CF-Connecting-IP')

	// Validate the token by calling the "/siteverify" API.
	let formData = new FormData()
	formData.append('secret', TURNSTILE_SECRET)
	// @ts-ignore
	formData.append('response', token)
	// @ts-ignore
	formData.append('remoteip', ip)

	const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		body: formData,
		method: 'POST',
	})

	const outcome = await result.json()
	if (!outcome.success) {
		return new Response(JSON.stringify({message: 'The provided captcha was not valid!'}), {status: 400})
	}

	const subscribeData = new FormData()
	// @ts-ignore
	subscribeData.append('email', body.get('email'))
	subscribeData.append('l', LIST_ID)

	await fetch('https://newsletter.kolaente.de/subscription/form', {
		body: subscribeData,
		method: 'POST',
	})

	return new Response(JSON.stringify({
			message: 'success',
		}),
	)
}
