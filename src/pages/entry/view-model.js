import * as dateFns from 'date-fns'

/**
 * View model for a tech radar entry.
 *
 * Transforms and exposes only the properties required by the entry template,
 * and formats ISO datetimes to GDS format (d MMMM yyyy).
 */
class EntryViewModel {
  /**
   * Create an entry view model.
   *
   * @param {Object} entry - The validated entry object
   * @param {string} entry.title - Entry title
   * @param {string} entry.description - Entry description
   * @param {string} entry.createdTimestamp - ISO datetime of creation
   * @param {string} entry.updatedTimestamp - ISO datetime of last update
   * @param {Array} entry.history - Array of history objects
   */
  constructor (entry = {}) {
    this.entry = this._formatEntry(entry)
    this.history = this._formatHistory(entry.history)
  }

  /**
   * Format entry fields, applying date formatting.
   *
   * @private
   * @param {Object} entry
   * @returns {Object} Formatted entry object
   */
  _formatEntry (entry) {
    return {
      title: entry.title,
      description: entry.description,
      createdTimestamp: this._formatGdsDate(entry.createdTimestamp),
      updatedTimestamp: this._formatGdsDate(entry.updatedTimestamp)
    }
  }

  /**
   * Format history items, applying date formatting.
   *
   * @private
   * @param {Array} history
   * @returns {Array} Formatted history array
   */
  _formatHistory (history = []) {
    return history.map(h => ({
      updatedTimestamp: this._formatGdsDate(h.updatedTimestamp),
      ring: h.ring,
      reason: h.reason,
      nextSteps: h.nextSteps
    }))
  }

  /**
   * Format an ISO datetime string to GDS format (d MMMM yyyy).
   *
   * @private
   * @param {string} iso - ISO datetime string
   * @returns {string} Formatted date
   */
  _formatGdsDate (iso) {
    return dateFns.format(iso, 'd MMMM yyyy')
  }

  /**
   * Create a view model from a radar YAML entries map.
   *
   * @static
   * @param {Object} entriesMap - Map of entry IDs to entry objects
   * @param {string} entryId - The entry ID to retrieve
   * @returns {EntryViewModel|null} View model or null if not found
   */
  static fromRadarYaml (entriesMap, entryId) {
    return entriesMap[entryId]?.entry
      ? new EntryViewModel(entriesMap[entryId].entry)
      : null
  }
}

export {
  EntryViewModel
}
