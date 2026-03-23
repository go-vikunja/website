import {spawnSync} from 'node:child_process'
import {writeFileSync, readFileSync, unlinkSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'

const SECTION_SHORT = '=== SHORT (Mastodon, Bluesky, GitHub Release, Discourse, Matrix) ==='
const SECTION_LINKEDIN = '=== LINKEDIN ==='

/**
 * Generates content variants using claude CLI, opens $EDITOR for review,
 * and returns parsed sections. Also builds the newsletter from the blog
 * post with image URLs fixed from the live site.
 */
export async function generateAndEdit(blogPostPath, version) {
	const blogContent = readFileSync(blogPostPath, 'utf-8')
	const blogUrl = `https://vikunja.io/changelog/vikunja-v${version}-was-released`

	// Strip frontmatter for newsletter
	const contentWithoutFrontmatter = blogContent.replace(/^---[\s\S]*?---\s*/, '')

	// Build newsletter: blog post content with absolute image URLs from live site
	const newsletter = await buildNewsletter(contentWithoutFrontmatter, blogUrl)

	const prompt = `You are helping announce a Vikunja release (version ${version}).

Here is the blog post content:

${blogContent}

Generate two content variants. Output them in EXACTLY this format with these exact section markers:

${SECTION_SHORT}

[Write a tweet-style announcement, max 280 characters. Include the version number, 1-2 key highlights, and the blog post URL: ${blogUrl}]

${SECTION_LINKEDIN}

[Write a 2-3 paragraph LinkedIn post in a professional but approachable tone. Mention key features and improvements. Include the blog post URL.]`

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
	return {short, linkedin, newsletter}
}

async function buildNewsletter(mdxContent, blogUrl) {
	// Fetch the live page to get transformed image URLs
	let imageMap = new Map()
	try {
		const response = await fetch(blogUrl)
		if (response.ok) {
			const html = await response.text()
			const imgMatches = [...html.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*/g)]
			for (const match of imgMatches) {
				const src = match[1].startsWith('http') ? match[1] : `https://vikunja.io${match[1]}`
				imageMap.set(match[2], src)
			}
		}
	} catch {
		console.log('Warning: Could not fetch live page for image URLs. Newsletter images may need manual fixing.')
	}

	// Rewrite relative image paths to absolute URLs
	let content = mdxContent
	// Replace markdown images ![alt](path) with absolute URLs
	content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
		if (src.startsWith('http')) return match
		// Try to find the image URL from the live page by alt text
		const liveUrl = imageMap.get(alt)
		if (liveUrl) return `![${alt}](${liveUrl})`
		// Fall back to absolute URL
		return `![${alt}](https://vikunja.io${src.startsWith('/') ? '' : '/'}${src})`
	})

	// Rewrite relative links to absolute
	content = content.replace(/\[([^\]]*)\]\(\/([^)]+)\)/g, '[$1](https://vikunja.io/$2)')

	return content
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
