import { JSDOM } from 'jsdom'

import { RadarQuadrant } from '../lib/renderer.js'

async function _buildRadarQuadrant (quadrant, entries) {
  const jsdom = new JSDOM('<html><body></body></html>', {
    pretendToBeVisual: true
  })

  const svg = jsdom.window.document.createElement('svg')
  const id = 'radar'
  svg.setAttribute('id', id)

  jsdom.window.document.body.appendChild(svg)
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  // create renderer quadrant and render blips (pass jsdom window into constructor)
  const quadrantRenderer = new RadarQuadrant(quadrant, jsdom.window)
  quadrantRenderer.init(id)

  for (const item of entries) {
    quadrantRenderer.addBlip(item.ring, item)
  }

  // JSDOM auto-converts attributes to lowercase, 'viewBox' however is case-sensitive.
  // Workaround is to replace 'viewbox' with 'viewBox' in the final HTML.
  const html = jsdom.window.document.getElementById(id).outerHTML

  return html.replace('viewbox=', 'viewBox=')
}

async function buildRadar (entries) {
  const { quadrants, rings, quadrant_entries: quadrantEntries } = entries

  const svgs = []

  for (const [quadrantIndex, quadrantName] of quadrants.entries()) {
    const projected = []

    const groups = quadrantEntries[quadrantName] || {}

    for (const [ringIndex, ringName] of rings.entries()) {
      const items = groups[ringName] || []

      for (const item of items) {
        projected.push({ ...item, quadrant: quadrantIndex, ring: ringIndex })
      }
    }

    const svg = await _buildRadarQuadrant(quadrantIndex, projected)

    svgs.push({
      quadrant: quadrantName,
      svg
    })
  }

  return svgs
}

export { buildRadar }
