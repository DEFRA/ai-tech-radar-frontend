/**
 * Clamps a value between min and max bounds.
 *
 * @param {number} value - The value to clamp.
 * @param {number} min - The minimum allowed value.
 * @param {number} max - The maximum allowed value.
 * @returns {number} The clamped value.
 */
function clamp (value, min, max) {
  return Math.max(min, Math.min(max, value))
}

/**
 * Generates a random number within a given range.
 *
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (exclusive).
 * @returns {number} A random number between min and max.
 */
function randomInRange (min, max) {
  return min + Math.random() * (max - min)
}

/**
 * Calculates ring boundary radii from a maximum radius and fractions.
 *
 * @param {number} maxRadius - The maximum radius of the outermost ring.
 * @param {number[]} fractions - Array of fraction values that sum to 1.
 * @returns {number[]} Array of accumulated radii for each ring boundary.
 */
function calculateRingBoundaries (maxRadius, fractions) {
  const boundaries = []

  fractions.forEach((fraction) => {
    const last = boundaries.length ? boundaries[boundaries.length - 1] : 0
    boundaries.push(last + fraction * maxRadius)
  })

  return boundaries
}

/**
 * Generates a random angle within a range with optional inset from edges.
 *
 * @param {number} start - The start angle in radians.
 * @param {number} end - The end angle in radians.
 * @param {number} inset - The inset from edges in radians.
 * @returns {number} A random angle between start and end (with inset).
 */
function randomAngleInRange (start, end, inset) {
  const angleRange = end - start

  if (Math.abs(angleRange) > inset * 2) {
    const direction = Math.sign(angleRange)
    const adjustedRange = Math.abs(angleRange) - inset * 2
    return start + direction * inset +
      Math.random() * adjustedRange * direction
  }

  return start + angleRange / 2
}

/**
 * Checks if two circular bounding boxes collide.
 *
 * @param {{x:number,y:number,r:number}} a - First circle ({x,y,r}).
 * @param {{x:number,y:number,r:number}} b - Second circle ({x,y,r}).
 * @param {number} spacing - Additional spacing buffer.
 * @returns {boolean} True if the circles collide (including spacing).
 */
function checkBoundingBoxCollision (a, b, spacing) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const distance = Math.hypot(dx, dy)

  const minDistance = a.r + b.r + spacing
  return distance < minDistance
}

export {
  clamp,
  randomInRange,
  calculateRingBoundaries,
  randomAngleInRange,
  checkBoundingBoxCollision
}
