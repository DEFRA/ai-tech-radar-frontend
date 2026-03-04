import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import YAML from 'yaml'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const radarFile = path.join(__dirname, 'radar.yaml')

async function readRadarYaml (filePath) {
  const raw = await fs.readFile(filePath, 'utf8')
  return YAML.parse(raw)
}

const radar = await readRadarYaml(radarFile)

function buildEntriesById (radarYaml) {
  const map = {}
  const quadrantEntries = radarYaml.quadrant_entries

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

const entriesMap = buildEntriesById(radar)

export {
  radar,
  entriesMap
}
