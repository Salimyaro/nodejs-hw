import express from "express";
const { Router } = express;
import validate from "./validation.js";
import contactsController from "../../controllers/contacts.js";
const router = Router();

router
  .post("/", validate.createContact, contactsController.create)
  .get("/", contactsController.getAll);

router
  .get("/:contactId", contactsController.getById)
  .patch("/:contactId", validate.updateContact, contactsController.update)
  .delete("/:contactId", contactsController.remove);

export default router;
