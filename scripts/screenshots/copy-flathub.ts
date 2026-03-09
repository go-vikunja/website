import {cpSync} from 'fs'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const vikunjaDir = join(__dirname, '../../src/assets/images/vikunja')
const flathubDir = join(__dirname, '../../public/flathub-images')

cpSync(join(vikunjaDir, '01-task-overview.png'), join(flathubDir, '01-task-overview.png'))
cpSync(join(vikunjaDir, '01-task-overview-dark.png'), join(flathubDir, '01-task-overview-dark.png'))
console.log('Flathub images copied.')
