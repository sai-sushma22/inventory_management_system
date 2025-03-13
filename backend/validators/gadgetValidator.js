const Joi = require('joi');

const gadgetSchema = {
  createSingle: Joi.object({
    name: Joi.string().required().min(2).max(100),
    description: Joi.string().optional(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
    image_url: Joi.string().uri().optional()
  }),

  createBulk: Joi.array().items(
    Joi.object({
      name: Joi.string().required().min(2).max(100),
      description: Joi.string().optional(),
      price: Joi.number().positive().required(),
      quantity: Joi.number().integer().min(0).required(),
      image_url: Joi.string().uri().optional()
    })
  ),

  update: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string(),
    price: Joi.number().positive(),
    quantity: Joi.number().integer().min(0),
    image_url: Joi.string().uri()
  })
};

module.exports = gadgetSchema;