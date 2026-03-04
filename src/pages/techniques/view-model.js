/**
 * View model for the Techniques page.
 *
 * Builds an ordered list of rings with their technique entries.
 */
class TechniquesViewModel {
  /**
   * @param {Array<{name:string,entries:Array}>} rings
   */
  constructor (rings = []) {
    this.rings = rings
  }

  /**
   * Build a TechniquesViewModel from a radar YAML object.
   *
   * @param {Object} sourceRadar
   * @returns {TechniquesViewModel}
   */
  static fromRadarYaml (sourceRadar) {
    const techniques = sourceRadar?.entries?.Techniques || {}
    const ringsOrder = sourceRadar?.rings || []

    const rings = ringsOrder.map(ringName => {
      const items = techniques[ringName] || []
      const entries = items.map(item => TechniquesViewModel._mapTechnique(item, ringName))

      return { name: ringName, entries }
    })

    return new TechniquesViewModel(rings)
  }

  /**
   * Map a raw technique item to the view model shape.
   *
   * @private
   * @param {Object} item
   * @param {string} ringName
   * @returns {Object}
   */
  static _mapTechnique (item, ringName) {
    return {
      label: item.label,
      title: item.title,
      id: item.id,
      quadrant: 'Techniques',
      ring: ringName,
      description: item.description
    }
  }
}

export {
  TechniquesViewModel
}
