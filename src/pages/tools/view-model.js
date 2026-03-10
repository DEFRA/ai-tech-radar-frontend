/**
 * View model for the Tools page.
 *
 * Builds an ordered list of rings with their tool entries.
 */
class ToolsViewModel {
  /**
   * @param {Array<{name:string,entries:Array}>} rings
   */
  constructor (rings) {
    this.rings = rings
  }

  /**
   * Build a ToolsViewModel from a radar YAML object.
   *
   * @param {Object} sourceRadar
   * @returns {ToolsViewModel}
   */
  static fromRadarYaml (sourceRadar) {
    const tools = sourceRadar.entries.Tools
    const ringsOrder = sourceRadar.rings

    const rings = ringsOrder.map(ringName => {
      const items = tools[ringName] || []
      const entries = items.map(item =>
        ToolsViewModel._mapTool(item, ringName)
      )

      return { name: ringName, entries }
    })

    return new ToolsViewModel(rings)
  }

  /**
   * Map a raw tool item to the view model shape.
   *
   * @private
   * @param {Object} item
   * @param {string} ringName
   * @returns {Object}
   */

  static _mapTool (item, ringName) {
    return {
      label: item.label,
      title: item.title,
      id: item.id,
      quadrant: 'Tools',
      ring: ringName,
      description: item.description
    }
  }
}

export { ToolsViewModel }
