import express from "express";
const { Router } = express;
import validate from "./validation.js";
import contactsController from "../../../controllers/contacts.js";
import guard from "../../../helpers/guard.js";
const router = Router();

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

export default router;
