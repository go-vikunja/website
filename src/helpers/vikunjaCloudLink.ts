import {locales} from '../i18n/locales'

export const VIKUNJA_CLOUD_LOGIN_LINK = 'https://app.vikunja.cloud/?redirectToProvider=true'

/** @deprecated Use VIKUNJA_CLOUD_LOGIN_LINK or vikunjaCloudSignupLink(). */
export const VIKUNJA_CLOUD_LINK = VIKUNJA_CLOUD_LOGIN_LINK

export type VikunjaCloudPlan = 'personal' | 'family' | 'organization'

export function vikunjaCloudSignupLink(ref: string, plan?: VikunjaCloudPlan): string {
	const url = new URL('https://vikunja.cloud/register')
	if (plan) {
		url.searchParams.set('plan', plan)
	}
	url.searchParams.set('ref', ref)
	return url.toString()
}

// '/de/compare/todoist/' -> 'compare-todoist', '/' -> 'home'
export function pageRef(url: URL): string {
	const segments = url.pathname.split('/').filter(Boolean)
	if (segments.length > 0 && (locales as readonly string[]).includes(segments[0])) {
		segments.shift()
	}
	return segments.join('-') || 'home'
}
