import { platformsController }  from './controller.js'
//import { platformsController } from '~/src/pages/platforms/controller.js'

// refactored version
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