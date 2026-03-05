import { statusCodes } from '../../constants/status-codes.js'
import { radar } from '../../tech-radar/radar.js'
import { PlatformsViewModel } from './view-model.js'

/**
 * Get platforms controller
 *
 * @param {import('@hapi/hapi').Request} request - Hapi request object
 * @param {import('@hapi/hapi').ResponseToolkit} h - Hapi response toolkit
 *
 * @returns {import('@hapi/hapi').ResponseObject} The response object representing the platforms page
 */

function getPlatforms(_request, h) {
  const model = PlatformsViewModel.fromRadarYaml(radar)

  return h.view('platforms/page.njk', { model })
    .code(statusCodes.HTTP_STATUS_OK)
}

const platformsController = { getPlatforms }

export {
  platformsController 
}