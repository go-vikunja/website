import {spawnSync} from 'node:child_process'
import {createInterface} from 'node:readline'

export async function postToLinkedin(text) {
	// Copy text to clipboard
	try {
		const proc = spawnSync('xclip', ['-selection', 'clipboard'], {
			input: text,
			encoding: 'utf-8',
		})
		if (proc.status === 0) {
			console.log('LinkedIn post text copied to clipboard.')
		} else {
			console.log('Could not copy to clipboard (xclip not available). Text:')
			console.log('---')
			console.log(text)
			console.log('---')
		}
	} catch {
		console.log('Could not copy to clipboard. Text:')
		console.log('---')
		console.log(text)
		console.log('---')
	}

	// Open LinkedIn in browser
	try {
		spawnSync('xdg-open', ['https://www.linkedin.com/feed/'], {
			stdio: 'ignore',
			detached: true,
		})
	} catch {
		console.log('Could not open browser. Please navigate to https://www.linkedin.com/feed/')
	}

	// Wait for user
	const rl = createInterface({input: process.stdin, output: process.stdout})
	await new Promise(resolve => {
		rl.question('Press Enter after posting on LinkedIn...', () => {
			rl.close()
			resolve()
		})
	})

	return 'manual'
}
