import { frameworksController } from './controller.js'

const frameworksRouter = {
  plugin: {
    name: 'frameworks',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/frameworks',
          handler: frameworksController.getFrameworks
        }
      ])
    }
  }
}

export {
  frameworksRouter
}
