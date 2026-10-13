#!/usr/bin/env node

import {parseArgs} from 'node:util'

import {confirm} from './publish-release/confirm.js'
import {postToListmonkSecurityList} from './publish-release/platforms/listmonk.js'

const SEVERITIES = ['low', 'medium', 'high', 'critical']

function exitWithUsage(message) {
	console.error(message)
	console.error('Usage: node scripts/announce-security-release.js <version> --date YYYY-MM-DD --severity <low|medium|high|critical> [--dry-run]')
	console.error('Example: node scripts/announce-security-release.js 2.7.1 --date 2026-10-20 --severity high --dry-run')
	process.exit(1)
}

function formatReleaseDate(date) {
	const parsed = new Date(`${date}T00:00:00Z`)
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
		exitWithUsage(`Invalid --date "${date}"`)
	}
	if (date < new Date().toISOString().slice(0, 10)) {
		exitWithUsage(`--date ${date} is in the past`)
	}

	return new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(parsed)
}

// The list is open for anyone to subscribe, so this must not contain any details about the vulnerabilities.
function buildAnnouncement(version, releaseDate, severity) {
	return `<p>Vikunja ${version} will be released on <strong>${releaseDate}</strong>. It contains security fixes, the most severe of them rated <strong>${severity}</strong>.</p>

<p>Please plan to upgrade your instance on that day.</p>

<p>To give everyone time to upgrade, I'll only publish details about the vulnerabilities together with the release. You'll get another email with a summary of what was fixed once it is out.</p>
`
}

async function main() {
	const {values, positionals} = parseArgs({
		allowPositionals: true,
		options: {
			date: {type: 'string'},
			severity: {type: 'string'},
			'dry-run': {type: 'boolean', default: false},
		},
	})

	const [version] = positionals
	if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
		exitWithUsage('Missing or invalid version')
	}
	if (!values.date) {
		exitWithUsage('Missing --date')
	}
	if (!SEVERITIES.includes(values.severity)) {
		exitWithUsage('Missing or invalid --severity')
	}

	const releaseDate = formatReleaseDate(values.date)
	const title = `Security release: Vikunja ${version} on ${releaseDate}`
	const announcement = buildAnnouncement(version, releaseDate, values.severity)

	console.log(`Subject: ${title}\n`)
	console.log(announcement)

	if (values['dry-run']) {
		console.log('[DRY RUN] No campaign was created.')
		return
	}

	const shouldCreate = await confirm('Create this as a draft campaign for the security list?')
	if (!shouldCreate) {
		return
	}

	const url = await postToListmonkSecurityList(announcement, title)
	if (!url) {
		process.exit(1)
	}
	console.log(`Draft created, review and send it in Listmonk: ${url}`)
}

main().catch(error => {
	console.error(error)
	process.exit(1)
})
