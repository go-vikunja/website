import {createInterface} from 'node:readline'

export async function confirm(question) {
	const rl = createInterface({input: process.stdin, output: process.stdout})
	return new Promise(resolve => {
		rl.question(`${question} [Y/n] `, answer => {
			rl.close()
			resolve(answer.toLowerCase() !== 'n')
		})
	})
}
