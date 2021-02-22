import express from "express";
const { Router } = express;
import Contacts from "../../model/index.js";
import validate from "./validation.js";
const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.status(200).json({
      status: "success",
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:contactId", async ({ params }, res, next) => {
  try {
    const contact = await Contacts.getContactById(params.contactId);
    if (contact) {
      return res.status(200).json({
        status: "success",
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
});

router.post("/", validate.createContact, async ({ body }, res, next) => {
  try {
    // Присвокние ID новому контакту должно происходить в моделе при работе с базой данных, а не при обработке запроса!!!
    const contact = await Contacts.addContact(body);
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        contact,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:contactId", async ({ params }, res, next) => {
  try {
    const contact = await Contacts.removeContact(params.contactId);
    if (contact) {
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "contact deleted",
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
});

router.patch(
  "/:contactId",
  validate.updateContact,
  async ({ params, body }, res, next) => {
    try {
      if (!body.name && !body.email && !body.phone) {
        return res.status(400).json({
          status: "error",
          code: 400,
          message: "missing fields",
        });
      }
      const contact = await Contacts.updateContact(params.contactId, body);
      if (contact) {
        return res.status(200).json({
          status: "success",
          code: 200,
          data: {
            contact,
          },
        });
      } else {
        return res.status(404).json({
          status: "error",
          code: 404,
          message: "Not Found",
        });
      }
    } catch (e) {
      next(e);
    }
  }
);

export default router;
