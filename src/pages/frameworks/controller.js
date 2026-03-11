import { statusCodes } from '../../constants/status-codes.js'
import { radar } from '../../tech-radar/radar.js'
import { FrameworksViewModel } from './view-model.js'

/**
 * Get frameworks controller
 *
 * @param {import('@hapi/hapi').Request} request - Hapi request object
 * @param {import('@hapi/hapi').ResponseToolkit} h - Hapi response toolkit
 *
 * @returns {import('@hapi/hapi').ResponseObject} The response object representing the frameworks page
 */

function getFrameworks (_request, h) {
  const model = FrameworksViewModel.fromRadarYaml(radar)

  return h.view('frameworks/page.njk', { model })
    .code(statusCodes.HTTP_STATUS_OK)
}

const frameworksController = { getFrameworks }

export {
  frameworksController
}
