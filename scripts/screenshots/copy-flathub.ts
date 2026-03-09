import {cpSync} from 'fs'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const vikunjaDir = join(__dirname, '../../src/assets/images/vikunja')
const flathubDir = join(__dirname, '../../public/flathub-images')

cpSync(join(vikunjaDir, '01-task-overview.png'), join(flathubDir, '01-task-overview.png'))
// 09-task-detail-dark.png will be added when dark mode screenshot is implemented
console.log('Flathub images copied.')
