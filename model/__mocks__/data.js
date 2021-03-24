const contacts = [
  {
    subscription: "free",
    _id: "605a2d1ed2d24d12a05fd0f8",
    name: "Thomas2 Lucas",
    email: "nec@ullaco.mh",
    phone: "(704) 398-7993",
    owner: {
      _id: "605626e63ebd204bf463f971",
    },
    createdAt: "2021-03-23T18:02:06.636Z",
    updatedAt: "2021-03-23T18:02:06.636Z",
  },
  {
    subscription: "free",
    _id: "605a2d2bd2d24d12a05fd0f9",
    name: "Thomas Lucas",
    email: "newc@ullaco.mh",
    phone: "(704) 395-7943",
    owner: {
      _id: "605626e63ebd204bf463f971",
    },
    createdAt: "2021-03-23T18:02:19.876Z",
    updatedAt: "2021-03-23T18:02:19.876Z",
  },
];

const newContact = {
  name: "Thomas3 Lucas",
  email: "newc3@ullaco.mh",
  phone: "(704) 595-7943",
};

const User = {
  _id: "605626e63ebd204bf463f971",
  subscription: "free",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNTYyNmU2M2ViZDIwNGJmNDYzZjk3MSIsImlhdCI6MTYxNjYxMjI1OH0.y9CburOKsEPhjLuuCSzoA7IfzXmVUQj0zXVGzoAesps",
  verify: true,
  email: "test@email.com",
  password: "$2a$08$pY47acQT14EDyljhYdtLpOhFBRK/0OaTpopGqE7ext5JKF3PNESGu",
  verificationToken: null,
  avatarURL:
    "https://s.gravatar.com/avatar/096d520c9101f943c940e33dc1596f52?s=250",
};

const users = [];
users.push(User);

const newUser = { email: "test2@email.com", password: "qwe123" };

module.exports = { contacts, newContact, User, users, newUser };
