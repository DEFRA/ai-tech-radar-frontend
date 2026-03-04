import Boom from '@hapi/boom'

import { statusCodes } from '../../constants/status-codes.js'
import { entriesMap } from '../../tech-radar/radar.js'
import { EntryViewModel } from './view-model.js'

function getEntry (request, h) {
  const { quadrant: quadrantSlug, entryId } = request.params

  const model = EntryViewModel.fromRadarYaml(entriesMap, entryId)

  if (!model) {
    throw Boom.notFound('Entry not found')
  }

  return h.view('entry/page.njk', { quadrantSlug, model })
    .code(statusCodes.HTTP_STATUS_OK)
}

export {
  getEntry
}
