import * as entryController from './controller.js'

const routes = [
  {
    method: 'GET',
    path: '/{quadrant}/{entryId}',
    handler: entryController.getEntry
  }
]

const entryRouter = {
  plugin: {
    name: 'entryRouter',
    register (server) {
      server.route(routes)
    }
  }
}

export {
  entryRouter
}
