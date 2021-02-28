import Contacts from "../model/contacts.js";

const getAll = async (_req, res, next) => {
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
};

const getById = async ({ params }, res, next) => {
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
};

const create = async ({ body }, res, next) => {
  try {
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
};

const remove = async ({ params }, res, next) => {
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
};

const update = async ({ params, body }, res, next) => {
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
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
}
