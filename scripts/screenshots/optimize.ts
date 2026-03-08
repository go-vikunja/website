import sharp from 'sharp'
import {glob} from 'glob'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const imageDir = join(__dirname, '../../src/assets/images/help')

async function optimize() {
  const files = await glob(join(imageDir, '*.png'))
  for (const file of files) {
    const info = await sharp(file).metadata()
    // Resize if wider than 1200px (good max for docs)
    if (info.width && info.width > 1200) {
      const buffer = await sharp(file)
        .resize(1200, null, {withoutEnlargement: true})
        .png({quality: 85, compressionLevel: 9})
        .toBuffer()
      await sharp(buffer).toFile(file)
    } else {
      // Just optimize compression
      const buffer = await sharp(file)
        .png({quality: 85, compressionLevel: 9})
        .toBuffer()
      await sharp(buffer).toFile(file)
    }
    console.log(`Optimized: ${file}`)
  }
}

optimize()
