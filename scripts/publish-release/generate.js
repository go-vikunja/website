import {spawnSync} from 'node:child_process'
import {writeFileSync, readFileSync, unlinkSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'

const SECTION_SHORT = '=== SHORT (Mastodon, Bluesky, GitHub Release, Discourse, Matrix) ==='
const SECTION_LINKEDIN = '=== LINKEDIN ==='
const SECTION_NEWSLETTER = '=== NEWSLETTER (Listmonk) ==='

/**
 * Generates content variants using claude CLI, opens $EDITOR for review,
 * and returns parsed sections.
 */
export async function generateAndEdit(blogPostPath, version) {
	const blogContent = readFileSync(blogPostPath, 'utf-8')
	const blogUrl = `https://vikunja.io/changelog/vikunja-v${version}-was-released`

	// Fetch image URLs from the live published page
	let imageUrls = ''
	try {
		const response = await fetch(blogUrl)
		if (response.ok) {
			const html = await response.text()
			const imgMatches = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)]
			if (imgMatches.length > 0) {
				imageUrls = '\n\nImage URLs from the live page:\n' + imgMatches.map(m => m[1]).join('\n')
			}
		}
	} catch {
		console.log('Warning: Could not fetch live page for image URLs. Newsletter images may need manual fixing.')
	}

	const prompt = `You are helping announce a Vikunja release (version ${version}).

Here is the blog post content:

${blogContent}
${imageUrls}

Generate three content variants. Output them in EXACTLY this format with these exact section markers:

${SECTION_SHORT}

[Write a tweet-style announcement, max 280 characters. Include the version number, 1-2 key highlights, and the blog post URL: ${blogUrl}]

${SECTION_LINKEDIN}

[Write a 2-3 paragraph LinkedIn post in a professional but approachable tone. Mention key features and improvements. Include the blog post URL.]

${SECTION_NEWSLETTER}

[Write the full blog post content as HTML suitable for an email newsletter. Convert all relative URLs to absolute URLs (base: https://vikunja.io). For images, use the image URLs from the live page listed above if available, otherwise construct absolute URLs. Keep all the content from the original blog post.]`

	console.log('Generating content variants with Claude...')
	const claudeResult = spawnSync('claude', ['-p', prompt], {
		encoding: 'utf-8',
		maxBuffer: 10 * 1024 * 1024,
		stdio: ['pipe', 'pipe', 'inherit'],
	})

	if (claudeResult.status !== 0) {
		throw new Error(`Claude CLI failed with exit code ${claudeResult.status}`)
	}

	const generatedContent = claudeResult.stdout

	// Write to temp file for editing
	const tmpFile = join(tmpdir(), `vikunja-release-${version}-${Date.now()}.txt`)
	writeFileSync(tmpFile, generatedContent, 'utf-8')

	// Open in editor
	const editor = process.env.EDITOR || 'vi'
	console.log(`Opening ${editor} for review. Save and close when done.`)
	const editorResult = spawnSync(editor, [tmpFile], {
		stdio: 'inherit',
	})

	if (editorResult.status !== 0) {
		throw new Error(`Editor exited with code ${editorResult.status}`)
	}

	// Parse edited content
	const editedContent = readFileSync(tmpFile, 'utf-8')
	unlinkSync(tmpFile)

	return parseSections(editedContent)
}

function parseSections(content) {
	const shortIdx = content.indexOf(SECTION_SHORT)
	const linkedinIdx = content.indexOf(SECTION_LINKEDIN)
	const newsletterIdx = content.indexOf(SECTION_NEWSLETTER)

	if (shortIdx === -1 || linkedinIdx === -1 || newsletterIdx === -1) {
		throw new Error('Could not find all section markers in edited content. Make sure you kept the === markers.')
	}

	const short = content
		.slice(shortIdx + SECTION_SHORT.length, linkedinIdx)
		.trim()
	const linkedin = content
		.slice(linkedinIdx + SECTION_LINKEDIN.length, newsletterIdx)
		.trim()
	const newsletter = content
		.slice(newsletterIdx + SECTION_NEWSLETTER.length)
		.trim()

	return {short, linkedin, newsletter}
}
