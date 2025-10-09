import { initializeSearch, search } from './search-client'
import type { SearchResult } from './search-client'

// DOM elements
let modal: HTMLElement | null = null
let backdrop: HTMLElement | null = null
let input: HTMLInputElement | null = null
let resultsList: HTMLElement | null = null
let loadingState: HTMLElement | null = null
let emptyState: HTMLElement | null = null
let noResultsState: HTMLElement | null = null
let statusRegion: HTMLElement | null = null

// State
let selectedIndex = -1
let currentResults: SearchResult[] = []
let searchInitialized = false
let lastFocusedElement: HTMLElement | null = null

// Debouncing
let searchTimeout: ReturnType<typeof setTimeout> | null = null
const SEARCH_DEBOUNCE_MS = 150

// Focusable elements selector
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Initialize search UI
 * Call this when DOM is ready
 */
export function initializeSearchUI(): void {
  // Get DOM elements
  modal = document.getElementById('search-modal')
  backdrop = document.getElementById('search-backdrop')
  input = document.getElementById('search-input') as HTMLInputElement
  resultsList = document.getElementById('search-results-list')
  loadingState = document.getElementById('search-loading')
  emptyState = document.getElementById('search-empty')
  noResultsState = document.getElementById('search-no-results')
  statusRegion = document.getElementById('search-status')

  if (!modal || !input || !resultsList) {
    console.warn('Search UI elements not found')
    return
  }

  // Attach event listeners
  attachEventListeners()
}

/**
 * Attach all event listeners
 */
function attachEventListeners(): void {
  if (!modal || !backdrop || !input) return

  // Search button click (handle all search buttons on the page)
  const searchButtons = document.querySelectorAll('.search-button')
  searchButtons.forEach(button => {
    button.addEventListener('click', openModal)
  })

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      openModal()
    }

    // ESC to close
    if (e.key === 'Escape' && modal?.classList.contains('show')) {
      closeModal()
    }
  })

  // Click outside modal content to close
  const modalWrapper = document.getElementById('search-modal-wrapper')
  modalWrapper?.addEventListener('click', (e) => {
    // Only close if clicking the wrapper, not the modal content
    if (e.target === modalWrapper) {
      closeModal()
    }
  })

  // Input changes
  input.addEventListener('input', handleSearchInput)

  // Keyboard navigation in input
  input.addEventListener('keydown', handleInputKeydown)

  // Click on results
  resultsList?.addEventListener('click', handleResultClick)

  // Focus trap
  document.addEventListener('keydown', handleFocusTrap)
}

/**
 * Open search modal
 */
async function openModal(): Promise<void> {
  console.log('Opening search modal')
  if (!modal || !input) return

  // Store currently focused element to restore later
  lastFocusedElement = document.activeElement as HTMLElement

  // Show modal
  modal.classList.add('show')
  document.body.style.overflow = 'hidden'

  // Focus input
  input.focus()

  // Initialize search on first open
  if (!searchInitialized) {
    showLoadingState()
    try {
      await initializeSearch()
      searchInitialized = true
      hideLoadingState()
      showEmptyState()
    } catch (error) {
      console.error('Failed to initialize search:', error)
      hideLoadingState()
      // Could show error state here
    }
  }
}

/**
 * Close search modal
 */
function closeModal(): void {
  if (!modal || !input) return

  modal.classList.remove('show')
  document.body.style.overflow = ''

  // Clear search
  input.value = ''
  currentResults = []
  selectedIndex = -1
  renderResults()
  showEmptyState()

  // Restore focus to previously focused element
  if (lastFocusedElement && lastFocusedElement.focus) {
    lastFocusedElement.focus()
  }
}

/**
 * Handle search input changes
 */
function handleSearchInput(e: Event): void {
  const query = (e.target as HTMLInputElement).value

  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (query.trim().length < 2) {
    currentResults = []
    selectedIndex = -1
    renderResults()
    showEmptyState()
    return
  }

  // Debounce search
  searchTimeout = setTimeout(() => {
    currentResults = search(query)
    selectedIndex = -1
    renderResults()

    if (currentResults.length === 0) {
      showNoResultsState()
      announceToScreenReader('No results found')
    } else {
      hideAllStates()
      const resultText = currentResults.length === 1 ? '1 result' : `${currentResults.length} results`
      announceToScreenReader(`${resultText} found`)
    }
  }, SEARCH_DEBOUNCE_MS)
}

/**
 * Handle keyboard navigation in input
 */
function handleInputKeydown(e: KeyboardEvent): void {
  if (currentResults.length === 0) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      selectedIndex = Math.min(selectedIndex + 1, currentResults.length - 1)
      renderResults()
      scrollToSelected()
      break

    case 'ArrowUp':
      e.preventDefault()
      selectedIndex = Math.max(selectedIndex - 1, -1)
      renderResults()
      scrollToSelected()
      break

    case 'Enter':
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < currentResults.length) {
        navigateToResult(currentResults[selectedIndex])
      }
      break
  }
}

/**
 * Handle click on result item
 */
function handleResultClick(e: Event): void {
  const target = e.target as HTMLElement
  const resultItem = target.closest('a[data-index]') as HTMLElement

  if (resultItem) {
    const index = parseInt(resultItem.dataset.index || '-1')
    if (index >= 0 && index < currentResults.length) {
      navigateToResult(currentResults[index])
    }
  }
}

/**
 * Navigate to selected result
 */
function navigateToResult(result: SearchResult): void {
  window.location.href = result.id
}

/**
 * Render search results
 */
function renderResults(): void {
  if (!resultsList) return

  if (currentResults.length === 0) {
    resultsList.innerHTML = ''
    return
  }

  resultsList.innerHTML = currentResults
    .map((result, index) => {
      const isSelected = index === selectedIndex
      return `
        <li>
          <a
            href="${result.id}"
            class="block px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${isSelected ? 'bg-gray-100 dark:bg-gray-700' : ''}"
            data-index="${index}"
            role="option"
            aria-selected="${isSelected}"
          >
            <div class="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">${result.highlightedTitle}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">${result.highlightedExcerpt}</div>
          </a>
        </li>
      `
    })
    .join('')
}

/**
 * Scroll to selected result
 */
function scrollToSelected(): void {
  if (selectedIndex < 0 || !resultsList) return

  const selectedElement = resultsList.querySelector(`[data-index="${selectedIndex}"]`)
  selectedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

/**
 * Show/hide state elements
 */
function showLoadingState(): void {
  loadingState?.classList.remove('hidden')
  emptyState?.classList.add('hidden')
  noResultsState?.classList.add('hidden')
}

function hideLoadingState(): void {
  loadingState?.classList.add('hidden')
}

function showEmptyState(): void {
  loadingState?.classList.add('hidden')
  emptyState?.classList.remove('hidden')
  noResultsState?.classList.add('hidden')
}

function showNoResultsState(): void {
  loadingState?.classList.add('hidden')
  emptyState?.classList.add('hidden')
  noResultsState?.classList.remove('hidden')
}

function hideAllStates(): void {
  loadingState?.classList.add('hidden')
  emptyState?.classList.add('hidden')
  noResultsState?.classList.add('hidden')
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message: string): void {
  if (statusRegion) {
    statusRegion.textContent = message
  }
}

/**
 * Handle focus trap to keep focus within modal
 */
function handleFocusTrap(e: KeyboardEvent): void {
  // Only trap focus if modal is open and Tab key is pressed
  if (!modal?.classList.contains('show') || e.key !== 'Tab') {
    return
  }

  const modalContent = document.getElementById('search-modal-content')
  if (!modalContent) return

  // Get all focusable elements within modal
  const focusableElements = Array.from(
    modalContent.querySelectorAll(FOCUSABLE_SELECTOR)
  ) as HTMLElement[]

  if (focusableElements.length === 0) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  // If shift+tab on first element, go to last
  if (e.shiftKey && document.activeElement === firstElement) {
    e.preventDefault()
    lastElement.focus()
  }
  // If tab on last element, go to first
  else if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault()
    firstElement.focus()
  }
}
