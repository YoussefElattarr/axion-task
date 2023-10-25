const Joi = require("joi");

module.exports = {
  createValidation: (createSchema = Joi.object({
    name: Joi.string().min(3).max(300).required(),
    district: Joi.string().min(3).max(15).required(),
    city: Joi.string().min(3).max(15).required(),
    country: Joi.string().min(3).max(15).required(),
    schooladmin: Joi.string().min(3).max(20).required(),
  })),
  updateValidation: (updateSchema = Joi.object({
    name: Joi.string().min(3).max(300),
    district: Joi.string().min(3).max(15),
    city: Joi.string().min(3).max(15),
    country: Joi.string().min(3).max(15),
    schooladmin: Joi.string().min(3).max(20),
  })),
};
