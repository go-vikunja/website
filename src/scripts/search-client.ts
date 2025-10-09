import MiniSearch from 'minisearch'
import type { SearchIndexItem } from '../pages/api/search-index.json'

export interface SearchResult {
  id: string
  title: string
  excerpt: string
  highlightedTitle: string
  highlightedExcerpt: string
  score: number
}

interface MiniSearchResult {
  id: string
  score: number
  match: { [field: string]: string[] }
  [key: string]: any
}

// Minimum query length to trigger search
const MIN_QUERY_LENGTH = 2

// Search instance
let miniSearch: MiniSearch | null = null
let searchIndex: SearchIndexItem[] = []
let isInitialized = false

// Dev mode check
const isDev = import.meta.env.DEV

/**
 * Initialize search - loads index and creates MiniSearch instance
 * Called on first interaction (lazy loading)
 */
export async function initializeSearch(): Promise<void> {
  if (isInitialized) return

  try {
    const response = await fetch('/api/search-index.json')
    if (!response.ok) {
      throw new Error('Failed to load search index')
    }

    searchIndex = await response.json()

    // Initialize MiniSearch with configuration
    miniSearch = new MiniSearch({
      fields: ['title', 'headings', 'body', 'description'], // Fields to index
      storeFields: ['title', 'slug', 'headings', 'body'], // Fields to store
      searchOptions: {
        prefix: true, // Match partial words (e.g., "doc" matches "documentation")
        fuzzy: 0.2, // Allow typos (0.2 = 20% character difference)
        boost: {
          title: 30, // Boost title matches heavily
          headings: 20, // Boost heading matches
          description: 15, // Boost description matches
          body: 1, // Normal body text weight
        },
        combineWith: 'AND', // All terms must match
      },
    })

    // Add all documents to the index
    miniSearch.addAll(
      searchIndex.map((item) => ({
        id: item.slug,
        title: item.title,
        description: item.description,
        headings: item.headings.join(' '), // Join headings as string
        body: item.body,
        slug: item.slug,
      }))
    )

    isInitialized = true
  } catch (error) {
    console.error('Failed to initialize search:', error)
    throw error
  }
}

/**
 * Search documents
 */
export function search(query: string): SearchResult[] {
  if (!miniSearch || !query || query.trim().length < MIN_QUERY_LENGTH) {
    return []
  }

  const startTime = isDev ? performance.now() : 0

  const results = miniSearch.search(query.trim()) as MiniSearchResult[]
  const parsed = results.slice(0, 10).map(result => parseSearchResult(result, query))

  if (isDev) {
    const endTime = performance.now()
    console.debug(`Search for "${query}" took ${(endTime - startTime).toFixed(2)}ms, found ${results.length} results`)
  }

  return parsed
}

/**
 * Parse raw MiniSearch result into displayable format
 * Extracts relevant excerpt and highlights matched terms
 */
function parseSearchResult(result: MiniSearchResult, query: string): SearchResult {
  const doc = searchIndex.find(item => item.slug === result.id)
  if (!doc) {
    return {
      id: result.id,
      title: 'Unknown',
      excerpt: '',
      highlightedTitle: 'Unknown',
      highlightedExcerpt: '',
      score: result.score,
    }
  }

  // Use the actual query terms instead of MiniSearch's processed terms
  // Split query into individual words and normalize
  const queryTerms = new Set<string>(
    query.toLowerCase()
      .split(/\s+/)
      .filter(term => term.length >= 2) // Filter out very short terms
  )

  // Find best excerpt from body
  const excerpt = extractBestExcerpt(doc.body, queryTerms, 150)

  // Highlight matches in title and excerpt
  const highlightedTitle = highlightMatches(doc.title, queryTerms)
  const highlightedExcerpt = highlightMatches(excerpt, queryTerms)

  return {
    id: result.id,
    title: doc.title,
    excerpt,
    highlightedTitle,
    highlightedExcerpt,
    score: result.score,
  }
}

/**
 * Extract excerpt containing matched terms
 */
function extractBestExcerpt(text: string, matchedTerms: Set<string>, maxLength: number): string {
  if (!text || matchedTerms.size === 0) {
    return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '')
  }

  const lowerText = text.toLowerCase()
  let bestIndex = 0
  let bestScore = -1

  // Find position with most matched terms nearby
  for (const term of matchedTerms) {
    let searchStart = 0
    let index = lowerText.indexOf(term, searchStart)

    // Check all occurrences of this term
    while (index !== -1) {
      // Score based primarily on nearby match density, not position in text
      const nearbyCount = countNearbyMatches(lowerText, index, matchedTerms)
      const score = nearbyCount * 100 // Prioritize match density over position

      if (score > bestScore) {
        bestScore = score
        bestIndex = index
      }

      searchStart = index + 1
      index = lowerText.indexOf(term, searchStart)
    }
  }

  // If no matches found (shouldn't happen), return start of text
  if (bestScore === -1) {
    return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '')
  }

  // Extract excerpt around best position
  const start = Math.max(0, bestIndex - maxLength / 2)
  const end = Math.min(text.length, start + maxLength)
  const excerpt = text.slice(start, end)

  return (
    (start > 0 ? '...' : '') +
    excerpt +
    (end < text.length ? '...' : '')
  )
}

/**
 * Count how many matched terms are near a position
 */
function countNearbyMatches(text: string, position: number, matchedTerms: Set<string>): number {
  const windowSize = 100
  const window = text.slice(
    Math.max(0, position - windowSize),
    Math.min(text.length, position + windowSize)
  )

  let count = 0
  for (const term of matchedTerms) {
    if (window.includes(term)) {
      count++
    }
  }
  return count
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Highlight matched terms in text
 */
function highlightMatches(text: string, matchedTerms: Set<string>): string {
  if (!text || matchedTerms.size === 0) return escapeHtml(text)

  // First escape HTML
  let result = escapeHtml(text)
  const sortedTerms = Array.from(matchedTerms).sort((a, b) => b.length - a.length)

  // Then add highlight marks (safe because we escaped first)
  for (const term of sortedTerms) {
    const escapedTerm = escapeHtml(term)
    const regex = new RegExp(`(${escapeRegex(escapedTerm)})`, 'gi')
    result = result.replace(regex, '<mark class="search-highlight">$1</mark>')
  }

  return result
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
