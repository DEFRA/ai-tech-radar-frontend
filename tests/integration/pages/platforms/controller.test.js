import { constants as statusCodes } from 'node:http2'

import { createServer } from '../../../../src/server/server.js'

describe('#platformsController', () => {
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
      url: '/platforms'
    })

    expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)
  })

  test("Navigation highlights 'Platforms' as active", async () => {
    const { result } = await server.inject({ method: 'GET', url: '/platforms' })

    // Assert the service navigation marks Platforms as active using the
    // govuk-service-navigation__item--active class and aria-current="true".
    const navActiveRegex = /govuk-service-navigation__item--active[\s\S]*href="\/platforms"[\s\S]*aria-current="true"/i

    expect(result).toEqual(expect.stringMatching(navActiveRegex))
  })
})
