const Joi = require("joi");

module.exports = {
  createValidation: (createSchema = Joi.object({
    name: Joi.string().min(3).max(300).required(),
    age: Joi.number().min(1).max(6).required(),
    school: Joi.string().min(3).max(300).required(),
    classroom: Joi.string().min(3).max(300).required(),
  })),
  updateValidation: (updateSchema = Joi.object({
    name: Joi.string().min(3).max(300),
    age: Joi.number().min(1).max(6),
    classroom: Joi.string().min(3).max(300),
  })),
};
