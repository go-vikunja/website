export const NEWSLETTER_LISTS = {
	news: 'f0bc9ec2-56a4-48c8-baad-7a31b137484e',
	security: '698f4bc4-465d-4e33-849a-38e0c7224477',
} as const

export type NewsletterList = keyof typeof NEWSLETTER_LISTS

export function isNewsletterList(value: unknown): value is NewsletterList {
	return typeof value === 'string' && Object.hasOwn(NEWSLETTER_LISTS, value)
}
