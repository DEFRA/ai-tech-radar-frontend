import Joi from 'joi'

const entrySchema = Joi.object({
  label: Joi.number().integer().required(),
  title: Joi.string().trim().required(),
  description: Joi.string().allow('').trim().optional(),
  link: Joi.string().allow('').trim().optional(),
  createdTimestamp: Joi.date().iso().required(),
  updatedTimestamp: Joi.date().iso().required(),
  active: Joi.boolean().required()
}).label('Entry')

const quadrantGroupSchema = Joi.object({
  Endorse: Joi.array().items(entrySchema).required(),
  Pilot: Joi.array().items(entrySchema).required(),
  Assess: Joi.array().items(entrySchema).required(),
  'Do Not Use': Joi.array().items(entrySchema).required()
}).label('QuadrantGroup')

const radarSchema = Joi.object({
  quadrants: Joi.array().items(Joi.string().trim().required()).length(4).required(),
  rings: Joi.array().items(Joi.string().trim().required()).length(4).required(),
  quadrant_entries: Joi.object()
    .pattern(Joi.string().trim().required(), quadrantGroupSchema)
    .min(4)
    .max(4)
    .required()
}).required().label('Radar')

export { entrySchema, quadrantGroupSchema, radarSchema }
