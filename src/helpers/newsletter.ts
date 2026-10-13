const GENERAL_LIST = 'f0bc9ec2-56a4-48c8-baad-7a31b137484e'
const SECURITY_LIST = '698f4bc4-465d-4e33-849a-38e0c7224477'

export const NEWSLETTER_LISTS = {
	all: [GENERAL_LIST, SECURITY_LIST],
	security: [SECURITY_LIST],
} as const

export type NewsletterList = keyof typeof NEWSLETTER_LISTS

export function isNewsletterList(value: unknown): value is NewsletterList {
	return typeof value === 'string' && Object.hasOwn(NEWSLETTER_LISTS, value)
}
