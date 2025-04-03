const Joi = require("joi");

const registerValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone number must be 10 digits'
      }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone number must be 10 digits'
      }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  next();
};

module.exports = { registerValidation, loginValidation };