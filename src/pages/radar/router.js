import * as radarController from './controller.js'

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: radarController.getRadar
  }
]

const radarRouter = {
  plugin: {
    name: 'radarRouter',
    register (server) {
      server.route(routes)
    }
  }
}

export {
  radarRouter
}
