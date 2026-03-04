import * as techniquesController from './controller.js'

const routes = [
  {
    method: 'GET',
    path: '/techniques',
    handler: techniquesController.getTechniques
  }
]

const techniquesRouter = {
  plugin: {
    name: 'techniquesRouter',
    register (server) {
      server.route(routes)
    }
  }
}

export {
  techniquesRouter
}
