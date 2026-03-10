import { statusCodes } from '../../constants/status-codes.js'
import { radar } from '../../tech-radar/radar.js'
import { ToolsViewModel } from './view-model.js'

/**
 * Get tools controller
 *
 * @param {import('@hapi/hapi').Request} request - Hapi request object
 * @param {import('@hapi/hapi').ResponseToolkit} h - Hapi response toolkit
 *
 * @returns {import('@hapi/hapi').ResponseObject} The response object representing the tools page
 */

function getTools (_request, h) {
  const model = ToolsViewModel.fromRadarYaml(radar)

  return h.view('tools/page.njk', { model })
    .code(statusCodes.HTTP_STATUS_OK)
}

const toolsController = { getTools }

export {
  toolsController
}
