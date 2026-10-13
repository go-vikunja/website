import type {APIContext} from 'astro'
import {TURNSTILE_SECRET} from 'astro:env/server'
import {isNewsletterList, NEWSLETTER_LISTS} from '../../helpers/newsletter'

export const prerender = false

export async function POST({request}: APIContext) {
	const body = await request.formData()

	const list = body.get('list')
	if (!isNewsletterList(list)) {
		return new Response(JSON.stringify({message: 'The selected newsletter does not exist!'}), {status: 400})
	}

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
	for (const uuid of NEWSLETTER_LISTS[list]) {
		subscribeData.append('l', uuid)
	}

	const subscription = await fetch('https://newsletter.vikunja.io/subscription/form', {
		body: subscribeData,
		method: 'POST',
	})
	await subscription.text()

	return new Response(JSON.stringify({
			message: 'success',
		}),
	)
}
