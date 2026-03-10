/**
 * View model for the Frameworks page.
 *
 * Builds an ordered list of rings with their framework entries.
 */
class FrameworksViewModel {
  /**
   * @param {Array<{name:string,entries:Array}>} rings
   */
  constructor (rings) {
    this.rings = rings
  }

  /**
   * Build a FrameworksViewModel from a radar YAML object.
   *
   * @param {Object} sourceRadar
   * @returns {FrameworksViewModel}
   */
  static fromRadarYaml (sourceRadar) {
    const frameworks = sourceRadar.entries.Frameworks
    const ringsOrder = sourceRadar.rings

    const rings = ringsOrder.map(ringName => {
      const items = frameworks[ringName] || []
      const entries = items.map(item =>
        FrameworksViewModel._mapFramework(item, ringName)
      )

      return { name: ringName, entries }
    })

    return new FrameworksViewModel(rings)
  }

  /**
   * Map a raw framework item to the view model shape.
   *
   * @private
   * @param {Object} item
   * @param {string} ringName
   * @returns {Object}
   */

  static _mapFramework (item, ringName) {
    return {
      label: item.label,
      title: item.title,
      id: item.id,
      quadrant: 'Frameworks',
      ring: ringName,
      description: item.description
    }
  }
}

export { FrameworksViewModel }
