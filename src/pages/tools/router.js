import { toolsController } from './controller.js'

const toolsRouter = {
  plugin: {
    name: 'tools',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/tools',
          handler: toolsController.getTools
        }
      ])
    }
  }
}

export {
  toolsRouter
}
