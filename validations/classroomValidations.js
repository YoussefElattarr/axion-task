const Joi = require("joi");

module.exports = {
  createValidation: (createSchema = Joi.object({
    name: Joi.string().min(3).max(300).required(),
    school: Joi.string().min(3).max(300).required(),
    floor: Joi.number().min(1).max(6).required(),
  })),
  updateValidation: (updateSchema = Joi.object({
    name: Joi.string().min(3).max(300),
    floor: Joi.number().min(1).max(6),
  })),
};
