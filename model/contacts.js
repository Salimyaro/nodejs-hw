import Contact from "./schemas/contact.js";

async function addContact(body) {
  return await Contact.create(body);
}

async function listContacts() {
  return await Contact.find({});
}

async function getContactById(id) {
  return await Contact.findOne({ _id: id });
}

async function updateContact(id, body) {
  return await Contact.findByIdAndUpdate(
    { _id: id },
    { ...body },
    { new: true }
  );
}

async function removeContact(id) {
  return await Contact.findByIdAndRemove({ _id: id });
}

export default {
  addContact,
  listContacts,
  getContactById,
  updateContact,
  removeContact,
};
