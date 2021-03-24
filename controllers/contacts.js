const Contacts = require("../model/contacts");
const { HttpCode, Status } = require("../helpers/constants");

const getAll = async ({ query, user }, res, next) => {
  try {
    const contacts = await Contacts.listContacts(user.id, query);
    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        contacts,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getById = async ({ params, user }, res, next) => {
  try {
    const contact = await Contacts.getContactById(params.contactId, user.id);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: Status.SUCCESS,
        code: HttpCode.OK,
        data: {
          contact,
        },
      });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: Status.ERROR,
        code: HttpCode.NOT_FOUND,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const create = async ({ body, user }, res, next) => {
  try {
    const contact = await Contacts.addContact({ ...body, owner: user.id });
    return res.status(HttpCode.CREATED).json({
      status: Status.SUCCESS,
      code: HttpCode.CREATED,
      data: {
        contact,
      },
    });
  } catch (e) {
    next(e);
  }
};

const remove = async ({ params, user }, res, next) => {
  try {
    const contact = await Contacts.removeContact(params.contactId, user.id);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: Status.SUCCESS,
        code: HttpCode.OK,
        message: "contact deleted",
      });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: Status.ERROR,
        code: HttpCode.NOT_FOUND,
        message: "Not found",
      });
    }
  } catch (e) {
    next(e);
  }
};

const update = async ({ params, body, user }, res, next) => {
  try {
    if (!body.name && !body.email && !body.phone) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: Status.ERROR,
        code: HttpCode.BAD_REQUEST,
        message: "missing fields",
      });
    }
    const contact = await Contacts.updateContact(
      params.contactId,
      body,
      user.id
    );
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: Status.SUCCESS,
        code: HttpCode.OK,
        data: {
          contact,
        },
      });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: Status.ERROR,
        code: HttpCode.NOT_FOUND,
        message: "Not Found",
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
