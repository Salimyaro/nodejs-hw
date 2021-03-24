const Joi = require("joi");
const { HttpCode, Subscription } = require("../../../helpers/constants");

const schemaUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(20).alphanum().required(),
});

const schemaSubscriptionUpdate = Joi.object({
  subscription: Joi.valid(
    Subscription.FREE,
    Subscription.PRO,
    Subscription.PREMIUM
  ).required(),
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

function user(req, _res, next) {
  return validate(schemaUser, req.body, next);
}
function subscriptionUpdate(req, _res, next) {
  return validate(schemaSubscriptionUpdate, req.body, next);
}

function uploadAvatar(req, _res, next) {
  if (!req.file) {
    return next({
      status: HttpCode.BAD_REQUEST,
      message: "Field of avatar with file not found",
    });
  }
  next();
}

module.exports = {
  user,
  subscriptionUpdate,
  uploadAvatar,
};
