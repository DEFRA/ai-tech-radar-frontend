import fs from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

async function exportAsPng (svg, filePath, width, height) {
  const buffer = await sharp(Buffer.from(svg), { density: 96 })
    .resize(width, height)
    .png()
    .toBuffer()

  const dir = path.dirname(filePath)

  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(filePath, buffer)
}

async function exportAsSvg (svg, filePath) {
  const buffer = Buffer.from(svg)

  const dir = path.dirname(filePath)

  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(filePath, buffer)
}

export { exportAsPng, exportAsSvg }
