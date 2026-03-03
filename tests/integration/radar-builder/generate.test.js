import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

import { main } from '../../../radar-builder/generate.js'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))
const testArtifactsDir = path.join(dirname, '../../../.artifacts/test/tech-radar')

describe('#radarBuilderGenerate', () => {
  const destPrefix = path.join(testArtifactsDir, 'aice-tech-radar')

  beforeAll(async () => {
    await fs.mkdir(testArtifactsDir, { recursive: true })

    await main(destPrefix)
  })

  afterAll(async () => {
    await fs.rm(testArtifactsDir, { recursive: true, force: true })
  })

  test('should generate four SVG and four PNG files for each quadrant', async () => {
    const parentDir = path.dirname(destPrefix)
    const files = await fs.readdir(parentDir)

    const svgFiles = files.filter(f => f.endsWith('.svg'))
    const pngFiles = files.filter(f => f.endsWith('.png'))

    expect(svgFiles).toHaveLength(4)
    expect(pngFiles).toHaveLength(4)
  })

  test('should generate files with correct naming pattern', async () => {
    const parentDir = path.dirname(destPrefix)
    const files = await fs.readdir(parentDir)

    const generatedFiles = files.filter(f => f.startsWith('aice-tech-radar-'))

    expect(generatedFiles.length).toBe(8)
    expect(generatedFiles.some(f => f.endsWith('.svg'))).toBe(true)
    expect(generatedFiles.some(f => f.endsWith('.png'))).toBe(true)
  })

  test('should generate SVG files with valid SVG content', async () => {
    const parentDir = path.dirname(destPrefix)
    const files = await fs.readdir(parentDir)
    const svgFiles = files
      .filter(f => f.startsWith('aice-tech-radar-') && f.endsWith('.svg'))
      .map(f => path.join(parentDir, f))

    expect(svgFiles.length).toBe(4)

    const svgContents = await Promise.all(svgFiles.map(f => fs.readFile(f, 'utf-8')))
    expect(svgContents.every(content => content.includes('<svg') && content.includes('</svg>'))).toBe(true)
  })

  test('should generate PNG files with valid PNG signature', async () => {
    const parentDir = path.dirname(destPrefix)
    const files = await fs.readdir(parentDir)
    const pngFiles = files
      .filter(f => f.startsWith('aice-tech-radar-') && f.endsWith('.png'))
      .map(f => path.join(parentDir, f))

    expect(pngFiles.length).toBe(4)

    const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

    const buffers = await Promise.all(pngFiles.map(f => fs.readFile(f)))
    expect(buffers.every(buffer => buffer.subarray(0, 8).equals(pngSignature))).toBe(true)
  })
})
