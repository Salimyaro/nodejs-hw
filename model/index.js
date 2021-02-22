// Работа с файлом contacts.json реализована двумя методами:
//  1) через "lowdb"
//  2) работа с файлом напрямую через "fs" (код в коментах)

import db from "./db.js";
// import * as fs from "fs/promises";
// import * as path from "path";
import shortid from "shortid";
// import { handleError } from "../lib/handlerror.js";
// import { isAccessible } from "../lib/accessible.js";
// import createDirnameAndFileName from "../lib/dirname.js";

// const { __dirname } = createDirnameAndFileName(import.meta.url);
// const contactsPath = path.join(__dirname, "/contacts.json");

//=========================== UTILS ===========================
// async function getContactsList(p) {
//   try {
//     const contacts = JSON.parse(await fs.readFile(p));
//     return contacts;
//   } catch (e) {
//     handleError(e);
//   }
// }
//=============================================================

async function listContacts() {
  return db.get("contacts").value();
}
// async function listContacts(path = contactsPath) {
//   try {
//     if (await isAccessible(path)) {
//       return await getContactsList(path);
//     } else {
//       throw { message: `Wrong path: '${path}'` };
//     }
//   } catch (error) {
//     handleError(error);
//   }
// }

async function getContactById(id) {
  return db.get("contacts").find({ id }).value();
}
// async function getContactById(contactId, path = contactsPath) {
//   try {
//     if (await isAccessible(path)) {
//       const contacts = await getContactsList(path);
//       const contact = contacts.find((c) => c.id.toString() === contactId);
//       if (!contact)
//         throw { message: `No contact was found with ID '${contactId}'` };
//       return contact;
//     } else {
//       throw { message: `Wrong path: '${path}'` };
//     }
//   } catch (error) {
//     handleError(error);
//   }
// }

async function removeContact(id) {
  const [record] = db.get("contacts").remove({ id }).write();
  return record;
}
// async function removeContact(contactId, path = contactsPath) {
//   try {
//     if (await isAccessible(path)) {
//       const contacts = await getContactsList(path);
//       const filteredContacts = contacts.filter(
//         (c) => c.id.toString() !== contactId
//       );
//       if (contacts.length === filteredContacts.length)
//         throw {
//           message: `No contact was found with ID '${contactId}', and no contact was deleted`,
//         };
//       await fs.writeFile(path, JSON.stringify(filteredContacts));
//       console.log(`Contact with ID '${contactId}' was removed successfully`);
//     } else {
//       throw { message: `Wrong path: '${path}'` };
//     }
//   } catch (error) {
//     handleError(error);
//   }
// }

async function addContact(newOneContact) {
  const contactToAdd = {
    id: shortid.generate(),
    ...newOneContact,
  };
  db.get("contacts").push(contactToAdd).write();
  return contactToAdd;
}
// async function addContact(newOneContact, path = contactsPath) {
//   try {
//     if (await isAccessible(path)) {
//       const contactToAdd = {
//         id: shortid.generate(),
//         ...newOneContact,
//       };
//       const contacts = await getContactsList(path);
//       const newContacts = [...contacts, contactToAdd];
//       await fs.writeFile(path, JSON.stringify(newContacts));
//       console.log(`Contact was added successfully`);
//       return contactToAdd;
//     } else {
//       throw { message: `Wrong path: '${path}'` };
//     }
//   } catch (error) {
//     handleError(error);
//   }
// }

async function updateContact(id, body) {
  const contact = db.get("contacts").find({ id }).assign(body).value();
  db.write();
  return contact.id ? contact : null;
}
// async function updateContact (contactId, body, path = contactsPath) {
//   try {
//     if (await isAccessible(path)) {
//       const contacts = await getContactsList(path);
//       const index = contacts.findIndex((c) => c.id.toString() === contactId);
//       if (index === -1)
//         throw { message: `No contact was found with ID '${contactId}'` };
//       contacts[index] = { ...contacts[index], ...body };
//       await fs.writeFile(path, JSON.stringify(contacts));
//       console.log(`Contact was updated successfully`);
//       return contacts[index];
//     } else {
//       throw { message: `Wrong path: '${path}'` };
//     }
//   } catch (error) {
//     handleError(error);
//   }
// };

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
