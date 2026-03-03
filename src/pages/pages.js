import { radarRouter } from './radar/router.js'

const pageRouter = {
  plugin: {
    name: 'pageRouter',
    async register (server) {
      await server.register([
        radarRouter
      ])
    }
  }
}

export {
  pageRouter
}
