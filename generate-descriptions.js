#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'
import Anthropic from '@anthropic-ai/sdk'
import matter from 'gray-matter'

const anthropic = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY,
})

const missingOnly = process.argv.includes('--missing-only') || process.argv.includes('-m')

function extractMetaDescription(input) {
	const regex = /<meta_description>\s*([\s\S]*?)\s*<\/meta_description>/
	const match = input.match(regex)

	if (match && match[1]) {
		return match[1].replace(/(\r\n|\n|\r)/gm, '').trim()
	}

	return null
}

async function processFile(filePath) {
	try {
		const content = await fs.readFile(filePath, 'utf-8')
		const {data, content: documentContent} = matter(content)

		if (missingOnly && data.description) {
			console.log(`Skipping ${filePath}: Description already exists`)
			return
		}

		const msg = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20240620',
			max_tokens: 1024,
			messages: [{
				role: 'user', content: `You are tasked with writing a short description for a meta description tag based on provided content. This description will be used in search engine results to give users a brief overview of the page's content.

Follow these guidelines when writing the meta description:
1. Keep it concise and informative
2. Accurately summarize the main topic of the content
3. Include relevant keywords naturally
4. Make it compelling to encourage click-throughs
5. Avoid duplicate content from the text
6. Do not use quotes or special characters

Here is the content to analyze:
<content>
${documentContent}
</content>

Carefully read and analyze the provided content. Identify the main topic, key points, and any relevant keywords. Based on your analysis, write a concise meta description that effectively summarizes the content and entices users to click through to the page.

Your meta description should be between 110 characters long, including spaces. This length is optimal for display in search engine results pages.

Provide your meta description inside <meta_description> tags. Do not include the character count or any other text outside these tags.

<meta_description>
[Your 150-160 character meta description goes here]
</meta_description>`,
			}],
		})

		const description = extractMetaDescription(msg.content[0].text)

		const updatedFrontmatter = {
			...data,
			description,
		}

		const updatedContent = matter.stringify(documentContent, updatedFrontmatter)

		await fs.writeFile(filePath, updatedContent)
		console.log(`Updated: ${filePath}`)
	} catch (error) {
		console.error(`Error processing ${filePath}:`, error)
	}
}

async function processDirectory(directory) {
	if(!process.env.ANTHROPIC_API_KEY) {
		throw new Error('Please provide an api key for Anthropic using the ANTHROPIC_API_KEY env variable.')
	}

	try {
		const files = await fs.readdir(directory)
		for (const file of files) {
			const filePath = path.join(directory, file)
			const stats = await fs.stat(filePath)
			if (stats.isDirectory()) {
				await processDirectory(filePath)
			} else if (path.extname(file) === '.mdoc') {
				await processFile(filePath)
			}
		}
	} catch (error) {
		console.error(`Error processing directory ${directory}:`, error)
	}
}

const contentDirectory = path.join(process.cwd(), 'src', 'content')

processDirectory(contentDirectory)
	.then(() => console.log('Processing complete.'))
	.catch((error) => console.error('An error occurred:', error))