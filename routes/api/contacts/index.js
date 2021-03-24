const express = require("express");
const router = express.Router();

const contactsController = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");
const validate = require("./validation");

router
  .post("/", guard, validate.createContact, contactsController.create)
  .get("/", guard, contactsController.getAll);

router
  .get("/:contactId", guard, contactsController.getById)
  .patch(
    "/:contactId",
    guard,
    validate.updateContact,
    contactsController.update
  )
  .delete("/:contactId", guard, contactsController.remove);

module.exports = router;
