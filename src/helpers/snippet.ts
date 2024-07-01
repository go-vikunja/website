function markdownToPlainText(markdown: string): string {
	// Remove HTML tags
	return markdown.replace(/<\/?[^>]+(>|$)/g, '')
		// Remove markdown formatting characters
		.replace(/!\[.*?\]\(.*?\)/g, '')   // Images
		.replace(/\[.*?\]\(.*?\)/g, '')    // Links
		.replace(/`{1,3}.*?`{1,3}/g, '')   // Inline and block code
		.replace(/```.*?```/gs, '')        // Multiline code blocks
		.replace(/\*\*?(.*?)\*\*?/g, '$1') // Bold and italic
		.replace(/~~(.*?)~~/g, '$1')       // Strikethrough
		.replace(/^#+\s/gm, '')            // Headers
		.replace(/>\s/gm, '')              // Blockquotes
		.replace(/[-*+]\s/g, '')           // Lists
		.replace(/^\d+\.\s/gm, '')         // Ordered lists
		.replace(/\s+/g, ' ').trim()       // Excessive whitespace
}

export function generateSnippet(markdown: string): string {
	const input = markdownToPlainText(markdown)

	if (input.length <= 400) return input

	const maxLength = 500
	let truncated = input.slice(0, maxLength)

	const periodIndex = truncated.lastIndexOf('.', 500)
	if (periodIndex >= 400) {
		return truncated.slice(0, periodIndex + 1)
	}

	const lastSpaceIndex = truncated.lastIndexOf(' ')
	return truncated.slice(0, lastSpaceIndex) + '…'
}
