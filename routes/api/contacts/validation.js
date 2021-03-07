import Joi from "joi";
import { HttpCode } from "../../../helpers/constants.js";

const schemaCreateContact = Joi.object({
  name: Joi.string().min(3).max(60).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[(][\d]{3}[)]\s[\d]{3}[-][\d]{4}/, {
      name: "'(099) 333-4444' required phone number",
    })
    .required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(60).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^[(][\d]{3}[)]\s[\d]{3}[-][\d]{4}/, {
      name: "'(099) 333-4444' required phone number",
    })
    .optional(),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `${message.replace(/"/g, "")}`,
    });
  }
  next();
};

function createContact(req, _res, next) {
  return validate(schemaCreateContact, req.body, next);
}

function updateContact(req, _res, next) {
  return validate(schemaUpdateContact, req.body, next);
}

export default {
  createContact,
  updateContact,
};
