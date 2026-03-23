import { constants as statusCodes } from 'node:http2'

import { createServer } from '../../../../src/server/server.js'

describe('#toolsController', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Should provide expected response', async () => {
    const { statusCode } = await server.inject({
      method: 'GET',
      url: '/tools'
    })

    expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)
  })

  test("Navigation highlights 'Tools' as active", async () => {
    const { result } = await server.inject({ method: 'GET', url: '/tools' })

    // Assert the service navigation marks Tools as active using the
    // defra-service-navigation__link class and aria-current="page".
    const navActiveRegex = /defra-service-navigation__link[\s\S]*href="\/tools"[\s\S]*aria-current="page"/i

    expect(result).toEqual(expect.stringMatching(navActiveRegex))
  })

  test('renders breadcrumbs with home and tools navigation', async () => {
    const { result } = await server.inject({ method: 'GET', url: '/tools' })

    expect(result).toEqual(expect.stringMatching(/govuk-breadcrumbs/))
    expect(result).toEqual(expect.stringMatching(/href="\//))
    expect(result).toEqual(expect.stringMatching(/Home/))
    expect(result).toEqual(expect.stringMatching(/Tools/))
  })
})
