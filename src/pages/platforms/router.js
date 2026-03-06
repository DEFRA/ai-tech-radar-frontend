import { platformsController } from './controller.js'

const platformsRouter = {
  plugin: {
    name: 'platforms',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/platforms',
          handler: platformsController.getPlatforms
        }
      ])
    }
  }
}

export {
  platformsRouter
}
