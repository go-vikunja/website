import {spawnSync} from 'node:child_process'
import {writeFileSync, readFileSync, unlinkSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join, dirname} from 'node:path'

const SECTION_SHORT = '=== SHORT (Mastodon, Bluesky, GitHub Release, Discourse, Matrix) ==='
const SECTION_LINKEDIN = '=== LINKEDIN ==='

/**
 * Generates content variants using claude CLI, opens $EDITOR for review,
 * and returns parsed sections. Also builds the newsletter from the blog
 * post with image URLs fixed from the live site.
 */
export async function generateAndEdit(blogPostPath, version) {
	const blogContent = readFileSync(blogPostPath, 'utf-8')

	// Extract slug from frontmatter
	const slugMatch = blogContent.match(/^---[\s\S]*?slug:\s*(\S+)[\s\S]*?---/m)
	const slug = slugMatch ? slugMatch[1].replace(/^\//, '') : `vikunja-v${version}-was-released`
	const blogUrl = `https://vikunja.io/changelog/${slug}`

	// Extract title from frontmatter
	const titleMatch = blogContent.match(/^---[\s\S]*?title:\s*'([^']+)'[\s\S]*?---/m)
		|| blogContent.match(/^---[\s\S]*?title:\s*"([^"]+)"[\s\S]*?---/m)
		|| blogContent.match(/^---[\s\S]*?title:\s*(.+)[\s\S]*?---/m)
	const blogTitle = titleMatch ? titleMatch[1].trim() : `Vikunja ${version} was released`

	// Build newsletter from the live rendered page
	const newsletter = await buildNewsletter(blogUrl)

	// Load brand voice guidelines
	const brandDir = join(dirname(blogPostPath), '..', '..', '..', 'brand')
	let voiceProfile = ''
	try {
		voiceProfile = readFileSync(join(brandDir, 'voice-profile.md'), 'utf-8')
	} catch {
		console.log('Warning: Could not load brand/voice-profile.md')
	}

	const prompt = `You are helping announce a Vikunja release (version ${version}).

${voiceProfile ? `## Brand Voice Guidelines\n\n${voiceProfile}\n\n` : ''}## Blog Post Content

${blogContent}

## Instructions

Generate two content variants following the brand voice guidelines above. Use emojis. Write in first person as the solo founder. Be technically confident but personally warm. Avoid corporate jargon, buzzwords, and artificial urgency.

Output them in EXACTLY this format with these exact section markers:

${SECTION_SHORT}

[Write a tweet-style announcement, max 280 characters. Use emojis. Include the version number, 1-2 key highlights, and the blog post URL: ${blogUrl}. Write as the founder — casual, direct, enthusiastic but not hyperbolic.]

${SECTION_LINKEDIN}

[Write a 2-3 paragraph LinkedIn post. Use emojis. Professional but approachable, written as the solo founder (first person singular). Mention key features and improvements. Include the blog post URL. Use the "Bootstrapped Builder's Journal" supporting angle — share the update as a solo founder building sustainable open-source software.]`

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

	const {short, linkedin} = parseSections(editedContent)
	return {short, linkedin, newsletter, blogTitle}
}

async function buildNewsletter(blogUrl) {
	const response = await fetch(blogUrl)
	if (!response.ok) {
		throw new Error(`Failed to fetch live blog post at ${blogUrl}: ${response.status}`)
	}

	const html = await response.text()

	// Extract content from the prose wrapper
	const proseMatch = html.match(/<div\s+class="prose[^"]*">([\s\S]*?)<\/div>\s*<\/article>/i)
		|| html.match(/<div\s+class="prose[^"]*">([\s\S]*?)<\/div>\s*<\/main>/i)
		|| html.match(/<div\s+class="prose[^"]*">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i)
	if (!proseMatch) {
		throw new Error('Could not find prose content wrapper on the live page')
	}

	let content = proseMatch[1].trim()

	// Remove the h1 — Listmonk adds it from the campaign subject
	content = content.replace(/<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')

	// Rewrite relative URLs to absolute
	content = content.replace(/(href|src)="\/([^"]+)"/g, '$1="https://vikunja.io/$2"')

	// Prepend online version link
	const onlineLink = `<p><em>You can find an online version of this post <a href="${blogUrl}">here</a>.</em></p>\n\n`

	return onlineLink + content
}

function parseSections(content) {
	const shortIdx = content.indexOf(SECTION_SHORT)
	const linkedinIdx = content.indexOf(SECTION_LINKEDIN)

	if (shortIdx === -1 || linkedinIdx === -1) {
		throw new Error('Could not find all section markers in edited content. Make sure you kept the === markers.')
	}

	const short = content
		.slice(shortIdx + SECTION_SHORT.length, linkedinIdx)
		.trim()
	const linkedin = content
		.slice(linkedinIdx + SECTION_LINKEDIN.length)
		.trim()

	return {short, linkedin}
}
