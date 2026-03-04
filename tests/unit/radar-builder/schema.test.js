import { radarSchema } from '../../../radar-builder/radar/schema.js'

describe('#radarSchema', () => {
  const validTimestamp = '2025-12-01T10:00:00Z'
  const validEntry = {
    label: 1,
    title: 'JavaScript',
    description: 'Programming language',
    link: 'https://example.com',
    id: 'javascript',
    history: [
      {
        ring: 'Endorse',
        reason: 'Initial entry',
        nextSteps: 'None',
        updatedTimestamp: validTimestamp
      }
    ],
    createdTimestamp: validTimestamp,
    updatedTimestamp: validTimestamp,
    active: true
  }

  const validQuadrantGroup = {
    Endorse: [validEntry],
    Pilot: [validEntry],
    Assess: [validEntry],
    'Do Not Use': [validEntry]
  }

  const validRadar = {
    quadrants: ['Tools', 'Languages', 'Frameworks', 'Practices'],
    rings: ['Endorse', 'Pilot', 'Assess', 'Do Not Use'],
    quadrant_entries: {
      Tools: validQuadrantGroup,
      Languages: validQuadrantGroup,
      Frameworks: validQuadrantGroup,
      Practices: validQuadrantGroup
    }
  }

  test('should pass validation with valid radar data', () => {
    const { error, value } = radarSchema.validate(validRadar)
    expect(error).toBeUndefined()
    expect(value).toBeDefined()
  })

  test('should fail validation when quadrants field is missing', () => {
    const invalidRadar = {
      ...validRadar,
      quadrants: undefined
    }
    const { error } = radarSchema.validate(invalidRadar)
    expect(error).toBeDefined()
  })

  test('should fail validation when quadrants array length is not 4', () => {
    const invalidRadar = {
      ...validRadar,
      quadrants: ['Tools', 'Languages', 'Frameworks']
    }
    const { error } = radarSchema.validate(invalidRadar)
    expect(error).toBeDefined()
  })

  test('should fail validation when rings field is missing', () => {
    const invalidRadar = {
      ...validRadar,
      rings: undefined
    }
    const { error } = radarSchema.validate(invalidRadar)
    expect(error).toBeDefined()
  })

  test('should fail validation when rings array length is not 4', () => {
    const invalidRadar = {
      ...validRadar,
      rings: ['Endorse', 'Pilot', 'Assess']
    }
    const { error } = radarSchema.validate(invalidRadar)
    expect(error).toBeDefined()
  })

  test('should fail validation when quadrant_entries field is missing', () => {
    const invalidRadar = {
      quadrants: validRadar.quadrants,
      rings: validRadar.rings
    }
    const { error } = radarSchema.validate(invalidRadar)
    expect(error).toBeDefined()
  })

  test('should fail validation when quadrant_entries does not have 4 keys', () => {
    const invalidRadar = {
      ...validRadar,
      quadrant_entries: {
        Tools: validQuadrantGroup,
        Languages: validQuadrantGroup,
        Frameworks: validQuadrantGroup
      }
    }
    const { error } = radarSchema.validate(invalidRadar)
    expect(error).toBeDefined()
  })

  test('should fail validation when quadrant_entries has more than 4 keys', () => {
    const invalidRadar = {
      ...validRadar,
      quadrant_entries: {
        Tools: validQuadrantGroup,
        Languages: validQuadrantGroup,
        Frameworks: validQuadrantGroup,
        Practices: validQuadrantGroup,
        Extra: validQuadrantGroup
      }
    }
    const { error } = radarSchema.validate(invalidRadar)
    expect(error).toBeDefined()
  })

  test('should fail validation when ring category is missing from quadrant group', () => {
    const invalidQuadrantGroup = {
      Endorse: [validEntry],
      Pilot: [validEntry],
      Assess: [validEntry]
      // 'Do Not Use' missing
    }
    const invalidRadar = {
      ...validRadar,
      quadrant_entries: {
        Tools: invalidQuadrantGroup,
        Languages: validQuadrantGroup,
        Frameworks: validQuadrantGroup,
        Practices: validQuadrantGroup
      }
    }
    const { error } = radarSchema.validate(invalidRadar)
    expect(error).toBeDefined()
  })

  test('should fail validation when entry is missing required label field', () => {
    const invalidEntry = {
      title: 'JavaScript',
      description: 'Programming language',
      id: 'javascript',
      history: [
        {
          ring: 'Endorse',
          reason: 'Initial entry',
          nextSteps: 'None',
          updatedTimestamp: validTimestamp
        }
      ],
      createdTimestamp: validTimestamp,
      updatedTimestamp: validTimestamp,
      active: true
    }
    const invalidQuadrantGroup = {
      Endorse: [invalidEntry],
      Pilot: [validEntry],
      Assess: [validEntry],
      'Do Not Use': [validEntry]
    }
    const invalidRadar = {
      ...validRadar,
      quadrant_entries: {
        Tools: invalidQuadrantGroup,
        Languages: validQuadrantGroup,
        Frameworks: validQuadrantGroup,
        Practices: validQuadrantGroup
      }
    }
    const { error } = radarSchema.validate(invalidRadar)
    expect(error).toBeDefined()
  })

  test('should fail validation when entry label is not an integer', () => {
    const invalidEntry = {
      label: 'not-a-number',
      title: 'JavaScript',
      id: 'javascript',
      history: [
        {
          ring: 'Endorse',
          reason: 'Initial entry',
          nextSteps: 'None',
          updatedTimestamp: validTimestamp
        }
      ],
      createdTimestamp: validTimestamp,
      updatedTimestamp: validTimestamp,
      active: true
    }
    const invalidQuadrantGroup = {
      Endorse: [invalidEntry],
      Pilot: [validEntry],
      Assess: [validEntry],
      'Do Not Use': [validEntry]
    }
    const invalidRadar = {
      ...validRadar,
      quadrant_entries: {
        Tools: invalidQuadrantGroup,
        Languages: validQuadrantGroup,
        Frameworks: validQuadrantGroup,
        Practices: validQuadrantGroup
      }
    }
    const { error } = radarSchema.validate(invalidRadar)
    expect(error).toBeDefined()
  })

  test('should fail validation when entry is missing required title field', () => {
    const invalidEntry = {
      label: 1,
      description: 'Programming language',
      id: 'javascript',
      history: [
        {
          ring: 'Endorse',
          reason: 'Initial entry',
          nextSteps: 'None',
          updatedTimestamp: validTimestamp
        }
      ],
      createdTimestamp: validTimestamp,
      updatedTimestamp: validTimestamp,
      active: true
    }
    const invalidQuadrantGroup = {
      Endorse: [invalidEntry],
      Pilot: [validEntry],
      Assess: [validEntry],
      'Do Not Use': [validEntry]
    }
    const invalidRadar = {
      ...validRadar,
      quadrant_entries: {
        Tools: invalidQuadrantGroup,
        Languages: validQuadrantGroup,
        Frameworks: validQuadrantGroup,
        Practices: validQuadrantGroup
      }
    }
    const { error } = radarSchema.validate(invalidRadar)
    expect(error).toBeDefined()
  })

  test('should fail validation when createdTimestamp is not ISO format', () => {
    const invalidEntry = {
      label: 1,
      title: 'JavaScript',
      id: 'javascript',
      history: [
        {
          ring: 'Endorse',
          reason: 'Initial entry',
          nextSteps: 'None',
          updatedTimestamp: validTimestamp
        }
      ],
      createdTimestamp: 'not-a-date',
      updatedTimestamp: validTimestamp,
      active: true
    }
    const invalidQuadrantGroup = {
      Endorse: [invalidEntry],
      Pilot: [validEntry],
      Assess: [validEntry],
      'Do Not Use': [validEntry]
    }
    const invalidRadar = {
      ...validRadar,
      quadrant_entries: {
        Tools: invalidQuadrantGroup,
        Languages: validQuadrantGroup,
        Frameworks: validQuadrantGroup,
        Practices: validQuadrantGroup
      }
    }
    const { error } = radarSchema.validate(invalidRadar)
    expect(error).toBeDefined()
  })

  test('should pass validation when entry description is empty string', () => {
    const entryWithoutDescription = {
      label: 1,
      title: 'JavaScript',
      description: '',
      link: 'https://example.com',
      id: 'javascript',
      history: [
        {
          ring: 'Endorse',
          reason: 'Initial entry',
          nextSteps: 'None',
          updatedTimestamp: validTimestamp
        }
      ],
      createdTimestamp: validTimestamp,
      updatedTimestamp: validTimestamp,
      active: true
    }
    const quadrantGroup = {
      Endorse: [entryWithoutDescription],
      Pilot: [validEntry],
      Assess: [validEntry],
      'Do Not Use': [validEntry]
    }
    const radar = {
      ...validRadar,
      quadrant_entries: {
        Tools: quadrantGroup,
        Languages: validQuadrantGroup,
        Frameworks: validQuadrantGroup,
        Practices: validQuadrantGroup
      }
    }
    const { error } = radarSchema.validate(radar)
    expect(error).toBeUndefined()
  })

  test('should pass validation when entry link is empty string', () => {
    const entryWithoutLink = {
      label: 1,
      title: 'JavaScript',
      description: 'Programming language',
      link: '',
      id: 'javascript',
      history: [
        {
          ring: 'Endorse',
          reason: 'Initial entry',
          nextSteps: 'None',
          updatedTimestamp: validTimestamp
        }
      ],
      createdTimestamp: validTimestamp,
      updatedTimestamp: validTimestamp,
      active: true
    }
    const quadrantGroup = {
      Endorse: [entryWithoutLink],
      Pilot: [validEntry],
      Assess: [validEntry],
      'Do Not Use': [validEntry]
    }
    const radar = {
      ...validRadar,
      quadrant_entries: {
        Tools: quadrantGroup,
        Languages: validQuadrantGroup,
        Frameworks: validQuadrantGroup,
        Practices: validQuadrantGroup
      }
    }
    const { error } = radarSchema.validate(radar)
    expect(error).toBeUndefined()
  })

  test('should fail validation when entry description is omitted', () => {
    const entryMissingDescription = {
      label: 1,
      title: 'JavaScript',
      link: 'https://example.com',
      id: 'javascript',
      history: [
        {
          ring: 'Endorse',
          reason: 'Initial entry',
          nextSteps: 'None',
          updatedTimestamp: validTimestamp
        }
      ],
      createdTimestamp: validTimestamp,
      updatedTimestamp: validTimestamp,
      active: true
    }
    const quadrantGroup = {
      Endorse: [entryMissingDescription],
      Pilot: [validEntry],
      Assess: [validEntry],
      'Do Not Use': [validEntry]
    }
    const radar = {
      ...validRadar,
      quadrant_entries: {
        Tools: quadrantGroup,
        Languages: validQuadrantGroup,
        Frameworks: validQuadrantGroup,
        Practices: validQuadrantGroup
      }
    }
    const { error } = radarSchema.validate(radar)
    expect(error).toBeDefined()
  })

  test('should pass validation when entry link is omitted', () => {
    const entryMinimal = {
      label: 1,
      title: 'JavaScript',
      description: 'Programming language',
      id: 'javascript',
      history: [
        {
          ring: 'Endorse',
          reason: 'Initial entry',
          nextSteps: 'None',
          updatedTimestamp: validTimestamp
        }
      ],
      createdTimestamp: validTimestamp,
      updatedTimestamp: validTimestamp,
      active: true
    }
    const quadrantGroup = {
      Endorse: [entryMinimal],
      Pilot: [validEntry],
      Assess: [validEntry],
      'Do Not Use': [validEntry]
    }
    const radar = {
      ...validRadar,
      quadrant_entries: {
        Tools: quadrantGroup,
        Languages: validQuadrantGroup,
        Frameworks: validQuadrantGroup,
        Practices: validQuadrantGroup
      }
    }
    const { error } = radarSchema.validate(radar)
    expect(error).toBeUndefined()
  })

  test('should fail validation when active is not a boolean', () => {
    const invalidEntry = {
      label: 1,
      title: 'JavaScript',
      id: 'javascript',
      history: [
        {
          ring: 'Endorse',
          reason: 'Initial entry',
          nextSteps: 'None',
          updatedTimestamp: validTimestamp
        }
      ],
      createdTimestamp: validTimestamp,
      updatedTimestamp: validTimestamp,
      active: 'yes'
    }
    const invalidQuadrantGroup = {
      Endorse: [invalidEntry],
      Pilot: [validEntry],
      Assess: [validEntry],
      'Do Not Use': [validEntry]
    }
    const invalidRadar = {
      ...validRadar,
      quadrant_entries: {
        Tools: invalidQuadrantGroup,
        Languages: validQuadrantGroup,
        Frameworks: validQuadrantGroup,
        Practices: validQuadrantGroup
      }
    }
    const { error } = radarSchema.validate(invalidRadar)
    expect(error).toBeDefined()
  })

  test('should trim whitespace from quadrant names', () => {
    const radarWithWhitespace = {
      quadrants: ['  Tools  ', 'Languages', 'Frameworks', 'Practices'],
      rings: validRadar.rings,
      quadrant_entries: validRadar.quadrant_entries
    }
    const { error, value } = radarSchema.validate(radarWithWhitespace)
    expect(error).toBeUndefined()
    expect(value.quadrants[0]).toBe('Tools')
  })

  test('should trim whitespace from ring names', () => {
    const radarWithWhitespace = {
      quadrants: validRadar.quadrants,
      rings: ['  Endorse  ', '  Pilot  ', 'Assess', 'Do Not Use'],
      quadrant_entries: validRadar.quadrant_entries
    }
    const { error, value } = radarSchema.validate(radarWithWhitespace)
    expect(error).toBeUndefined()
    expect(value.rings[0]).toBe('Endorse')
  })

  test('should trim whitespace from entry title', () => {
    const entryWithWhitespace = {
      label: 1,
      title: '  JavaScript  ',
      description: 'Programming language',
      link: 'https://example.com',
      id: 'javascript',
      history: [
        {
          ring: 'Endorse',
          reason: 'Initial entry',
          nextSteps: 'None',
          updatedTimestamp: validTimestamp
        }
      ],
      createdTimestamp: validTimestamp,
      updatedTimestamp: validTimestamp,
      active: true
    }
    const quadrantGroup = {
      Endorse: [entryWithWhitespace],
      Pilot: [validEntry],
      Assess: [validEntry],
      'Do Not Use': [validEntry]
    }
    const radar = {
      ...validRadar,
      quadrant_entries: {
        Tools: quadrantGroup,
        Languages: validQuadrantGroup,
        Frameworks: validQuadrantGroup,
        Practices: validQuadrantGroup
      }
    }
    const { error, value } = radarSchema.validate(radar)
    expect(error).toBeUndefined()
    expect(value.quadrant_entries.Tools.Endorse[0].title).toBe('JavaScript')
  })
})
