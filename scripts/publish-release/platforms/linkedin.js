import {createInterface} from 'node:readline'

export async function postToLinkedin(text) {
	console.log('LinkedIn post text:')
	console.log('---')
	console.log(text)
	console.log('---')
	console.log('Please post the above text to https://www.linkedin.com/feed/')

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
