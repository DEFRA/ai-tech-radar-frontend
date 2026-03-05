import * as d3 from 'd3'

import {
  clamp,
  randomInRange,
  calculateRingBoundaries,
  randomAngleInRange,
  checkBoundingBoxCollision
} from './utils.js'

const DEFAULT_CONFIG = {
  svg: {
    width: 512,
    height: 512,
    padding: 8
  },
  rings: {
    fractions: [0.35, 0.25, 0.2, 0.2]
  },
  blip: {
    outerRadius: 12.5,
    innerRadiusRatio: 0.55,
    angleInset: 0.08
  },
  blipInsetMultiplier: 1.5,
  collision: {
    spacing: 4,
    maxAttempts: 50
  },
  rendering: {
    colorPalette: [
      '#cce2d8',
      '#bbd4ea',
      '#fcd6c3',
      '#f4cdc6'
    ],
    fontPalette: [
      '#005a30',
      '#0c2d4a',
      '#6e3619',
      '#2a0b06'
    ]
  }
}

const QUADRANT_DEFINITIONS = [
  {
    startAngle: 3 * Math.PI / 2,
    endAngle: 2 * Math.PI,
    blipAngles: [-Math.PI, -Math.PI / 2],
    centerMultiplier: { x: 1, y: 1 },
    boundaryVectors: [{ x: -1, y: 0 }, { x: 0, y: -1 }]
  },
  {
    startAngle: 0,
    endAngle: Math.PI / 2,
    blipAngles: [0, -Math.PI / 2],
    centerMultiplier: { x: 0, y: 1 },
    boundaryVectors: [{ x: 1, y: 0 }, { x: 0, y: -1 }]
  },
  {
    startAngle: Math.PI / 2,
    endAngle: Math.PI,
    blipAngles: [0, Math.PI / 2],
    centerMultiplier: { x: 0, y: 0 },
    boundaryVectors: [{ x: 1, y: 0 }, { x: 0, y: 1 }]
  },
  {
    startAngle: Math.PI,
    endAngle: 3 * Math.PI / 2,
    blipAngles: [Math.PI / 2, Math.PI],
    centerMultiplier: { x: 1, y: 0 },
    boundaryVectors: [{ x: -1, y: 0 }, { x: 0, y: 1 }]
  }
]

/**
 * RadarQuadrant class for creating and managing a single quadrant of the radar.
 */
class RadarQuadrant {
  /**
   * Creates a new RadarQuadrant instance.
   *
   * @param {number} quadrantIndex - The quadrant index (0..3) corresponding to position map.
   * @param {object} options - Configuration options to override defaults (quadrants ignored).
   */
  constructor (quadrantIndex, jsdomWindow) {
    this.config = DEFAULT_CONFIG
    this.svg = null
    this.radarGroup = null
    this.maxRadius = null
    this.ringBoundaries = null
    this.existingBlips = []

    if (typeof quadrantIndex !== 'number' || quadrantIndex < 0 || quadrantIndex >= QUADRANT_DEFINITIONS.length) {
      throw new Error(`Invalid quadrant index: ${quadrantIndex}. Must be between 0 and ${QUADRANT_DEFINITIONS.length - 1}`)
    }

    this.index = quadrantIndex
    this.quadrant = QUADRANT_DEFINITIONS[quadrantIndex]
    if (!this.quadrant) {
      throw new Error(`Invalid quadrant index: ${quadrantIndex}`)
    }

    // store provided jsdom window for later DOM selection in init
    this.window = jsdomWindow

    // compute instance center from config and quadrant multiplier
    const { width, height } = this.config.svg
    const cm = this.quadrant?.centerMultiplier ?? { x: 0.5, y: 0.5 }
    this.centerPosition = { x: cm.x * width, y: cm.y * height }
  }

  /**
   * @private
   * Draws the rings for a quadrant.
   *
   * @param {object} quadrant - The quadrant definition.
   */
  _drawRings () {
    const quadrant = this.quadrant
    const { x: centerX, y: centerY } = this.centerPosition
    const startAngle = quadrant.startAngle
    const endAngle = quadrant.endAngle <= startAngle
      ? quadrant.endAngle + 2 * Math.PI
      : quadrant.endAngle

    const bgArc = d3.arc()
      .innerRadius(0)
      .outerRadius(this.maxRadius)
      .startAngle(startAngle)
      .endAngle(endAngle)

    this.radarGroup.append('path')
      .attr('class', 'radar-background')
      .attr('d', bgArc)
      .attr('fill', '#ffffff')
      .attr('transform', `translate(${centerX}, ${centerY})`)

    for (const radius of this.ringBoundaries) {
      const arc = d3.arc()
        .innerRadius(radius)
        .outerRadius(radius)
        .startAngle(startAngle)
        .endAngle(endAngle)

      this.radarGroup.append('path')
        .attr('class', 'radar-arc')
        .attr('d', arc)
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .attr('fill', 'none')
        .attr('stroke', '#cbd5e0')
        .attr('stroke-width', '1')
    }
  }

  /**
   * @private
   *
   * Draws boundary lines for this quadrant using configured boundary vectors.
   */
  _drawBoundaryLines () {
    const { x: centerX, y: centerY } = this.centerPosition
    const r = this.maxRadius
    const vectors = this.quadrant?.boundaryVectors ?? []

    for (const { x: vx, y: vy } of vectors) {
      const x = centerX + vx * r
      const y = centerY + vy * r
      this.radarGroup.append('line')
        .attr('class', 'radar-arc')
        .attr('x1', centerX)
        .attr('y1', centerY)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', '#c0c0c0')
        .attr('stroke-width', '2')
    }
  }

  /**
   * @private
   *
   * Calculates a blip position within a ring.
   *
   * @param {number} ringIndex - The ring index (0-based).
   *
   * @returns {object} Position object with `x`, `y`, and `radius`.
   * @throws {Error} If there is no space available in the ring to place a blip.
   */
  _calculateBlipPosition (ringIndex) {
    const { x: centerX, y: centerY } = this.centerPosition
    const [angleStart, angleEnd] = this.quadrant.blipAngles

    const ringOuter = this.ringBoundaries[ringIndex]
    const ringInner = ringIndex > 0 ? this.ringBoundaries[ringIndex - 1] : 0
    const edgeInset = this.config.blip.outerRadius * 2 +
      this.config.svg.padding

    const innerR = ringInner + edgeInset
    const outerR = ringOuter - edgeInset

    if (outerR <= innerR) {
      throw new Error(`No space available in ring ${ringIndex} to place a blip`)
    }

    const angle = randomAngleInRange(
      angleStart,
      angleEnd,
      this.config.blip.angleInset
    )
    const radius = randomInRange(innerR, outerR)

    const initialX = centerX + Math.cos(angle) * radius
    const initialY = centerY + Math.sin(angle) * radius

    const { width, height, padding } = this.config.svg
    const blipR = this.config.blip.outerRadius

    // Use a configurable multiplier to enforce a larger inset from the
    // bounding box edges. This keeps larger blips away from the visible
    // diagram edges to avoid visual clipping.
    const insetMultiplier = this.config.blipInsetMultiplier || 1
    const inset = Math.ceil(blipR * insetMultiplier)

    const x = clamp(initialX, -padding + inset, width + padding - inset)
    const y = clamp(initialY, -padding + inset, height + padding - inset)

    return { x, y, radius }
  }

  /**
   * @private
   *
   * Finds a non-colliding position for a blip.
   *
   * @param {number} ringIndex - The ring index (0-based).
  * @returns {object} Position object.
  * @throws {Error} If no non-colliding position is found after the configured attempts.
   */
  _findNonCollidingPosition (ringIndex) {
    const blipRadius = this.config.blip.outerRadius
    const { maxAttempts, spacing } = this.config.collision

    let attempt = 0

    while (attempt < maxAttempts) {
      const position = this._calculateBlipPosition(ringIndex)

      if (!position) {
        throw new Error(`Failed to calculate a candidate position for ring ${ringIndex}`)
      }

      const hasCollision = this.existingBlips.some((blip) =>
        checkBoundingBoxCollision(
          { x: position.x, y: position.y, r: blipRadius },
          { x: blip.x, y: blip.y, r: blipRadius },
          spacing
        )
      )

      if (!hasCollision) {
        return position
      }

      attempt++
    }

    throw new Error(`No non-colliding position found in ring ${ringIndex} after ${maxAttempts} attempts`)
  }

  /**
   * @private
   *
   * Renders a blip on the radar.
   *
   * @param {object} position - The position object containing `x` and `y`.
   * @param {string|number} label - The blip label/number.
   * @param {string} color - The blip color.
   * @param {object} [opts] - Optional rendering options.
   * @param {string} [opts.link] - Optional link for the blip (anchor href).
   * @param {string} [opts.title] - Optional title/alt text for accessibility.
   */
  _renderBlip (position, item, color, textColor) {
    const { x, y } = position
    const { link, title, label } = item
    const outerR = this.config.blip.outerRadius

    let groupWrapper = this.radarGroup
    let group

    if (link) {
      groupWrapper = this.radarGroup.append('a').attr('href', link).attr('target', '_top')
      group = groupWrapper.append('g').attr('class', 'blip-group')
    } else {
      group = this.radarGroup.append('g').attr('class', 'blip-group')
    }

    if (title) {
      group.append('title').text(title)
      groupWrapper.attr('role', 'img')
      groupWrapper.attr('aria-label', title)
    }

    const circle = group.append('circle')
      .attr('class', 'blip')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', outerR)
      .attr('fill', color)
      .attr('stroke', '#fff')
      .attr('stroke-width', '1')
      .attr('opacity', '0.95')
      .attr('cursor', 'pointer')

    if (title) {
      circle.attr('aria-label', title)
    }

    group.append('text')
      .attr('class', 'blip-number')
      .attr('x', x)
      .attr('y', y)
      .attr('font-size', '14px')
      .attr('font-family', 'Arial, Helvetica, sans-serif')
      .attr('font-weight', '900')
      .attr('fill', textColor || '#fff')
      .attr('dominant-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .attr('cursor', 'pointer')
      .text(label)
  }

  /**
   * Initializes the SVG container and calculates derived values.
   *
   * @param {string} containerSelector - The CSS selector for the SVG element.
   *
   * @returns {RadarQuadrant} The Quadrant instance for chaining.
   */
  init (id) {
    const { width, height, padding } = this.config.svg

    this.maxRadius = Math.min(width, height) - 2

    // Reduce the usable max radius by an additional inset derived from the
    // blip size so the rings are smaller and blips sit farther from the SVG
    // edges. This helps avoid clipping with larger blips.
    const extraInset = Math.ceil((this.config.blip.outerRadius || 0) * (this.config.blipInsetMultiplier || 1))
    this.maxRadius = Math.max(0, this.maxRadius - extraInset)

    this.ringBoundaries = calculateRingBoundaries(
      this.maxRadius,
      this.config.rings.fractions
    )

    if (!this.window || typeof this.window.document !== 'object') {
      throw new Error('RadarQuadrant requires a jsdom window provided in the constructor')
    }

    const element = this.window.document.getElementById(id)
    if (!element) {
      throw new Error(`Element with id '${id}' not found in provided window`)
    }

    this.svg = d3.select(element)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox',
        `${-padding} ${-padding} ${width + padding * 2} ${height + padding * 2}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')

    this.radarGroup = this.svg.append('g')

    this._drawRings()
    this._drawBoundaryLines()

    return this
  }

  /**
   * Adds a blip to the radar in a specific ring.
   *
   * @param {number} ringIndex - The ring index (0-based).
   * @param {object} data - An item object containing `label` and optional `link`/`title`.
   *
   * @throws {Error} If `ringIndex` is invalid or if placement fails (no non-colliding position).
   * @returns {object} The created blip record (position + item data).
   */
  addBlip (ringIndex, data) {
    if (ringIndex < 0 || ringIndex >= this.ringBoundaries.length) {
      throw new Error(`Invalid ring index: ${ringIndex}`)
    }

    const position = this._findNonCollidingPosition(ringIndex)

    const bgColor = this.config.rendering.colorPalette[ringIndex]
    const textColor = (this.config.rendering.fontPalette[ringIndex]) || '#fff'

    const item = data

    this._renderBlip(position, item, bgColor, textColor)

    const blip = {
      x: position.x,
      y: position.y,
      radius: position.radius,
      ringIndex,
      ...item
    }

    this.existingBlips.push(blip)

    return blip
  }
}

export {
  RadarQuadrant
}
