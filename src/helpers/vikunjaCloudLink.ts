const DEFAULT_VIKUNJA_CLOUD_LINK = 'https://app.vikunja.cloud/?redirectToProvider=true'

export const VIKUNJA_CLOUD_LINK =
       process.env.VIKUNJA_CLOUD_URL ?? DEFAULT_VIKUNJA_CLOUD_LINK
