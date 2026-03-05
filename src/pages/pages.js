import { radarRouter } from './radar/router.js'
import { techniquesRouter } from './techniques/router.js'
import { entryRouter } from './entry/router.js'

const pageRouter = {
  plugin: {
    name: 'pageRouter',
    async register (server) {
      await server.register([
        radarRouter,
        techniquesRouter,
        entryRouter
      ])
    }
  }
}

export {
  pageRouter
}
