import Joi from "joi";

const userCreateValidator = Joi.object({
  username: Joi.string()
    .min(3)
    .max(20)
    .required()
    .regex(/^[a-zA-Z0-9]{3,30}$/),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string().min(3).max(20).required(),
});

const userNameValidator = Joi.object({
  username: Joi.string()
    .min(3)
    .max(20)
    .required()
    .regex(/^[a-zA-Z0-9]{3,30}$/),
});

const userLoginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export { userCreateValidator, userNameValidator, userLoginValidator };
