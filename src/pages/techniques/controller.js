import { statusCodes } from '../../constants/status-codes.js'
import { radar } from '../../tech-radar/radar.js'
import { TechniquesViewModel } from './view-model.js'

/**
 * Get techniques controller
 *
 * @param {import('@hapi/hapi').Request} request - Hapi request object
 * @param {import('@hapi/hapi').ResponseToolkit} h - Hapi response toolkit
 *
 * @returns {import('@hapi/hapi').ResponseObject} The response object representing the techniques page
 */
function getTechniques (_request, h) {
  const model = TechniquesViewModel.fromRadarYaml(radar)

  return h.view('techniques/page.njk', { model })
    .code(statusCodes.HTTP_STATUS_OK)
}

export {
  getTechniques
}
