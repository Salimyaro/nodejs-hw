const request = require("supertest");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { User, contacts, newContact } = require("../model/__mocks__/data");
const app = require("../app");

const SECRET_KEY = process.env.JWT_SECRET;
const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User._id }, SECRET_KEY);
const fakeToken = "thisIsDefinetelyNotAValidToken";
User.token = token;

jest.mock("../model/contacts.js");
jest.mock("../model/users.js");
jest.mock("../services/email.js");

describe("Testing the route api/contacts", () => {
  describe("Testing api/contacts: get all contacts", () => {
    test("positive: returns list of contacts: should return code 200", async () => {
      const res = await request(app)
        .get(`/api/contacts`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.data.contacts).toBeInstanceOf(Object);
    });
    test("negative: wrong token: should return code 401", async () => {
      const res = await request(app)
        .get(`/api/contacts`)
        .set("Authorization", `Bearer ${fakeToken}`);
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
    });
  });
  describe("Testing api/contacts: get contact by id", () => {
    test("positive: returns contact: should return code 200", async () => {
      const contact = contacts[0];
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body).toBeInstanceOf(Object);
    });
    test("negative: contact not found: should return code 404", async () => {
      const id = "something";
      const res = await request(app)
        .get(`/api/contacts/${id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });
  });
  describe("Testing api/contacts: create contact", () => {
    test("positive: contact created: should return code 201", async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .send(newContact)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(201);
      expect(res.body).toBeDefined();
      expect(res.body).toBeInstanceOf(Object);
    });
    test("negative: name field missing: should return code 400", async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .send({
          email: "newmail@friends.com",
          phone: 123456789,
        })
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
    test("negative: email field missing: should return code 400", async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .send({
          name: "New",
          phone: 123456789,
        })
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
    test("negative: phone field missing: should return code 400", async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .send({
          name: "New",
          email: "newmail@friends.com",
        })
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
    test("negative: invalid email: should return code 400", async () => {
      const res = await request(app)
        .post(`/api/contacts`)
        .send({
          name: "New",
          email: "newmailatfriends.com",
          phone: 123456789,
        })
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
  });
  describe("Testing api/contacts: update contact", () => {
    test("positive: contact updated: should return code 200", async () => {
      const contact = contacts[0];
      const res = await request(app)
        .patch(`/api/contacts/${contact._id}`)
        .send({ name: "Thomas23 Lucas" })
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body).toBeInstanceOf(Object);
    });
    test("negative: contact not found: should return code 404", async () => {
      const id = "something";
      const res = await request(app)
        .patch(`/api/contacts/${id}`)
        .send({ name: "Thomas23 Lucas" })
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });
    test("negative: incorrect field name: should return code 400", async () => {
      const contact = contacts[0];
      const res = await request(app)
        .patch(`/api/contacts/${contact._id}`)
        .send({ definetelyWrongField: "oops" })
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
  });
  describe("Testing api/contacts: delete contact", () => {
    test("positive: contact removed: should return code 200", async () => {
      const contact = contacts[0];
      const res = await request(app)
        .delete(`/api/contacts/${contact._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body).toBeInstanceOf(Object);
    });
    test("negative: contact not found: should return code 404", async () => {
      const id = "something";
      const res = await request(app)
        .delete(`/api/contacts/${id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(404);
      expect(res.body).toBeDefined();
    });
  });
});
