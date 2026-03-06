/**
 * View model for the Platforms page.
 *
 * Builds an ordered list of rings with their platforms entries.
 */
class PlatformsViewModel {
  /**
   * @param {Array<{name:string,entries:Array}>} rings
   */
  constructor (rings) {
    this.rings = rings
  }

  /**
   * Build a PlatformsViewModel from a radar YAML object.
   *
   * @param {Object} sourceRadar
   * @returns {PlatformsViewModel}
   */
  static fromRadarYaml (sourceRadar) {
    const platforms = sourceRadar.entries.Platforms
    const ringsOrder = sourceRadar.rings

    const rings = ringsOrder.map(ringName => {
      const items = platforms[ringName] || []
      const entries = items.map(item =>
        PlatformsViewModel._mapPlatform(item, ringName)
      )

      return { name: ringName, entries }
    })

    return new PlatformsViewModel(rings)
  }

  /**
   * Map a raw platform item to the view model shape.
   *
   * @private
   * @param {Object} item
   * @param {string} ringName
   * @returns {Object}
   */

  static _mapPlatform (item, ringName) {
    return {
      label: item.label,
      title: item.title,
      id: item.id,
      quadrant: 'Platforms',
      ring: ringName,
      description: item.description
    }
  }
}

export { PlatformsViewModel }
