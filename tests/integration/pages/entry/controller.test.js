import fs from 'node:fs'
import path from 'node:path'
import { constants as statusCodes } from 'node:http2'

describe('#entryController', () => {
  let server

  beforeAll(async () => {
    const fixturePath = path.resolve(process.cwd(), 'tests/mocks/radar.yaml')
    const fixtureYaml = fs.readFileSync(fixturePath, 'utf8')

    vi.resetModules()

    vi.doMock('node:fs/promises', () => ({ default: { readFile: vi.fn().mockResolvedValue(fixtureYaml) } }))

    const { createServer } = await import('../../../../src/server/server.js')

    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    if (server) {
      await server.stop({ timeout: 0 })
    }
  })

  test('returns 404 for missing entry', async () => {
    const { statusCode } = await server.inject({
      method: 'GET',
      url: '/frameworks/non-existent'
    })

    expect(statusCode).toBe(statusCodes.HTTP_STATUS_NOT_FOUND)
  })

  test('renders entry frameworks/mcp with expected content and tag', async () => {
    const { statusCode, result } = await server.inject({
      method: 'GET',
      url: '/frameworks/mcp'
    })

    expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)

    expect(result).toEqual(expect.stringMatching(/MCP/))
    expect(result).toEqual(expect.stringMatching(/Model Context Protocol \(MCP\)/))
    expect(result).toEqual(expect.stringMatching(/1 December 2025/))
    expect(result).toEqual(expect.stringMatching(/govuk-tag--orange[\s\S]*Assess/))
  })

  test('renders entry platforms/aws-bedrock with expected content and tag', async () => {
    const { statusCode, result } = await server.inject({
      method: 'GET',
      url: '/platforms/aws-bedrock'
    })

    expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)

    expect(result).toEqual(expect.stringMatching(/AWS Bedrock/))
    expect(result).toEqual(expect.stringMatching(/Managed platform for foundation models/))
    expect(result).toEqual(expect.stringMatching(/1 December 2025/))
    expect(result).toEqual(expect.stringMatching(/govuk-tag--blue[\s\S]*Pilot/))
  })

  test('renders entry techniques/structured-prompting with expected content and tag', async () => {
    const { statusCode, result } = await server.inject({
      method: 'GET',
      url: '/techniques/structured-prompting'
    })

    expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)

    expect(result).toEqual(expect.stringMatching(/Structured Prompting/))
    expect(result).toEqual(expect.stringMatching(/Systematic approach to designing prompts/))
    expect(result).toEqual(expect.stringMatching(/1 December 2025/))
    expect(result).toEqual(expect.stringMatching(/govuk-tag--green[\s\S]*Endorse/))
  })

  test('renders entry tools/ai-tool with expected content and tag', async () => {
    const { statusCode, result } = await server.inject({
      method: 'GET',
      url: '/tools/ai-tool'
    })

    expect(statusCode).toBe(statusCodes.HTTP_STATUS_OK)

    expect(result).toEqual(expect.stringMatching(/AI Tool/))
    expect(result).toEqual(expect.stringMatching(/Example AI tool for demonstration purposes/))
    expect(result).toEqual(expect.stringMatching(/1 December 2025/))
    expect(result).toEqual(expect.stringMatching(/govuk-tag--green[\s\S]*Endorse/))
  })
})
