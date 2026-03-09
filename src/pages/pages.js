import { radarRouter } from './radar/router.js'
import { techniquesRouter } from './techniques/router.js'
import { entryRouter } from './entry/router.js'
import { platformsRouter } from './platforms/router.js'
import { frameworksRouter } from './frameworks/router.js'

const pageRouter = {
  plugin: {
    name: 'pageRouter',
    async register (server) {
      await server.register([
        radarRouter,
        techniquesRouter,
        entryRouter,
        platformsRouter,
        frameworksRouter
      ])
    }
  }
}

export {
  pageRouter
}
