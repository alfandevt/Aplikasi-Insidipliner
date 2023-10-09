const Joi = require("joi");

/* Joi Schemas */
/* Image */
const sendImg = Joi.object().keys({
  path: Joi.string().max(100).required(),
  filename: Joi.string().max(100).required(),
});

/* module export */
module.exports = { sendImg };
