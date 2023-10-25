const Joi = require("joi");

module.exports = {
  createValidation: (createSchema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(8).max(100).required(),
    type: Joi.string().min(3).max(15).required(),
    school: Joi.string().min(3).max(300).required(),
  }))
};
