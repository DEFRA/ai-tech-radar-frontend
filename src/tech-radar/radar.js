import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

import YAML from 'yaml'

import { validateRadar } from './schema.js'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))
const radarFile = path.join(dirname, 'radar.yaml')

async function _readRadarYaml (filePath) {
  const raw = await fs.readFile(filePath, 'utf8')
  const parsed = YAML.parse(raw)

  const { error, value } = validateRadar(parsed)

  if (error) {
    throw new Error(`Radar YAML validation error: ${error.message}`)
  }

  return value
}

const radar = await _readRadarYaml(radarFile)

function _buildEntriesById (radarYaml) {
  const map = {}
  const quadrantEntries = radarYaml.entries

  for (const [quadrant, rings] of Object.entries(quadrantEntries)) {
    for (const [ring, items] of Object.entries(rings)) {
      for (const item of items) {
        const data = { entry: item, quadrant, ring }
        map[item.id] = data
      }
    }
  }

  return map
}

const entriesMap = _buildEntriesById(radar)

export {
  radar,
  entriesMap
}
