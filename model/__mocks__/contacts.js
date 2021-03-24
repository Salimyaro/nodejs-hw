const { contacts } = require("./data");

const addContact = jest.fn((body) => {
  const newContact = { ...body, _id: "604e5a273108531bb00a7b30" };
  contacts.push(newContact);
  return newContact;
});

const listContacts = jest.fn((userId, { limit = "20", page = "1", sub }) => {
  return { total: contacts.length, limit, page, contacts };
});

const getContactById = jest.fn((id, userId) => {
  const [contact] = contacts.filter((el) => String(el._id) === String(id));
  return contact;
});

const updateContact = jest.fn((id, body, userId) => {
  let [contact] = contacts.filter((el) => String(el._id) === String(id));
  return contact ? (contact = { ...contact, ...body }) : null;
});

const removeContact = jest.fn((id, userId) => {
  const index = contacts.findIndex(
    (contact) => String(contact._id) === String(id)
  );
  return index !== -1 ? contacts.splice(index, 1) : null;
});

module.exports = {
  addContact,
  listContacts,
  getContactById,
  updateContact,
  removeContact,
};
