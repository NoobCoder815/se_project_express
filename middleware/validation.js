const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateCreateItem = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required().messages({
      "string.hex": "The ID must be a hexadecimal value",
      "string.length": "The ID must be 24 characters long",
      "any.required": "The ID field is required",
    }),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
      weather: Joi.string().valid("hot", "cold", "warm").required().messages({
        "string.empty": 'The "weather" field must be filled in',
      }),
    })
    .unknown(true),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().email().required().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required().messages({
      "string.hex": "The ID must be a hexadecimal value",
      "string.length": "The ID must be 24 characters long",
      "any.required": "The ID field is required",
    }),
    userId: Joi.string().length(24).hex().required().messages({
      "string.hex": "The ID must be a hexadecimal value",
      "string.length": "The ID must be 24 characters long",
      "any.required": "The ID field is required",
    }),
  }),
});

const validateUpdateUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required().messages({
      "string.hex": "The ID must be a hexadecimal value",
      "string.length": "The ID must be 24 characters long",
      "any.required": "The ID field is required",
    }),
  }),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});

module.exports = {
  validateCreateItem,
  validateCreateUser,
  validateId,
  validateUpdateUser,
  validateUserLogin,
};
