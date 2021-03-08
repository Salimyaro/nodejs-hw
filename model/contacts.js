import Contact from "./schemas/contact.js";

async function addContact(body) {
  return await Contact.create(body);
}

async function listContacts(
  userId,
  { limit = "20", page = "1", sub }
) {
  const subscription = sub ? { subscription: [sub] } : {};
  const results = await Contact.paginate(
    {
      owner: userId,
      ...subscription,
    },
    {
      limit,
      page,
      populate: {
        path: "owner",
        select: "id",
      },
    }
  );
  const { docs: contacts, totalDocs: total } = results;
  return { total: total.toString(), limit, page, contacts };
}

async function getContactById(id, userId) {
  return await Contact.findOne({ _id: id, owner: userId }).populate({
    path: "owner",
    select: "id",
  });
}

async function updateContact(id, body, userId) {
  return await Contact.findByIdAndUpdate(
    { _id: id, owner: userId },
    { ...body },
    { new: true }
  ).populate({
    path: "owner",
    select: "id",
  });
}

async function removeContact(id, userId) {
  return await Contact.findByIdAndRemove({ _id: id, owner: userId });
}

export default {
  addContact,
  listContacts,
  getContactById,
  updateContact,
  removeContact,
};
