import path from 'node:path'
import fs from 'node:fs/promises'
import url from 'node:url'

import YAML from 'yaml'

import { buildRadar } from './radar/builder.js'
import { radarSchema } from './radar/schema.js'
import { exportAsPng, exportAsSvg } from './radar/exporter.js'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

const PNG_WIDTH = 512
const PNG_HEIGHT = 512

async function main (dest = '.artifacts/tech-radar/aice-tech-radar') {
  const file = await fs.readFile(path.join(dirname, '../src/tech-radar/radar.yaml'), 'utf-8')
  const data = YAML.parse(file)

  const { value: validated, error } = radarSchema.validate(data, { abortEarly: false })

  if (error) {
    throw new Error(`Invalid radar data: ${error.message}`)
  }

  const svgs = await buildRadar(validated)

  for (const { quadrant, svg } of svgs) {
    const fileName = `${dest}-${quadrant}`.toLowerCase()

    await exportAsPng(svg, `${fileName}.png`, PNG_WIDTH, PNG_HEIGHT)
    await exportAsSvg(svg, `${fileName}.svg`)
  }
}

if (process.argv[1]?.endsWith('generate.js')) {
  await main(process.argv[2])
}

export { main }
