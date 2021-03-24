const request = require("supertest");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const { v4: uuid } = require("uuid");
require("dotenv").config();

const { User, newUser, users } = require("../model/__mocks__/data");
const app = require("../app");

const SECRET_KEY = process.env.JWT_SECRET;
const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User._id }, SECRET_KEY);
const fakeToken = "thisIsDefinetelyNotAValidToken";
const verificationToken = uuid();

User.token = token;

jest.mock("../model/contacts.js");
jest.mock("../model/users.js");
jest.mock("../services/email.js");

describe("Testing the route api/users/auth", () => {
  describe("Testing api/users/auth/register", () => {
    test("positive: successful register: should return code 201", async () => {
      const res = await request(app)
        .post(`/api/users/auth/register`)
        .send(newUser)
        .set("Accept", "application/json");
      expect(res.status).toEqual(201);
      expect(res.body).toBeDefined();
      expect(res.body).toBeInstanceOf(Object);
    });
    test("negative: dupe email upon register: should return code 409", async () => {
      const res = await request(app)
        .post(`/api/users/auth/register`)
        .send(newUser)
        .set("Accept", "application/json");
      expect(res.status).toEqual(409);
      expect(res.body).toBeDefined();
    });
    test("negative: no email upon register: should return code 400", async () => {
      const res = await request(app)
        .post(`/api/users/auth/register`)
        .send(newUser.password)
        .set("Accept", "application/json");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
    test("negative: no password upon signup: should return code 400", async () => {
      const res = await request(app)
        .post(`/api/users/auth/register`)
        .send(newUser.email)
        .set("Accept", "application/json");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
  });
  describe("Testing /auth/verify/verificationToken", () => {
    test("positive: successful verification: should return code 200", async () => {
      const user = users[1];
      user.verificationToken = verificationToken;
      const res = await request(app)
        .get(`/api/users/auth/verify/${verificationToken}`)
        .set("Accept", "application/json");
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });
    test("negative: incorrect token: should return code 400", async () => {
      const res = await request(app)
        .get(`/api/users/auth/verify/${fakeToken}`)
        .set("Accept", "application/json");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
    });
  });
  describe("Testing /api/users/auth/login", () => {
    test("negative: not verified: should return code 401", async () => {
      const user = users[1];
      user.verify = false;
      const res = await request(app)
        .post(`/api/users/auth/login`)
        .send(newUser)
        .set("Accept", "application/json");
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
    });
    test("positive: successful login: should return code 200", async () => {
      const user = users[1];
      user.verify = true;
      const res = await request(app)
        .post(`/api/users/auth/login`)
        .send(newUser)
        .set("Accept", "application/json");
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });
    test("negative: non-existing e-mail: should return code 401", async () => {
      const res = await request(app)
        .post(`/api/users/auth/login`)
        .send({ email: "fake@email.com", password: "qwe123" })
        .set("Accept", "application/json");
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
    });
    test("negative: incorrect password: should return code 401", async () => {
      const res = await request(app)
        .post(`/api/users/auth/login`)
        .send({ email: "test2@email.com", password: "qwerty" })
        .set("Accept", "application/json");
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
    });
  });
  describe("Testing /api/users/current", () => {
    test("positive: correct token: should return code 200", async () => {
      const res = await request(app)
        .get(`/api/users/current`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });
    test("negative: incorrect token: should return code 403", async () => {
      const res = await request(app)
        .get(`/api/users/current`)
        .set("Authorization", `Bearer ${fakeToken}`);
      expect(res.status).toEqual(401);
      expect(res.body).toBeDefined();
    });
  });
  describe("Testing /api/users/avatars", () => {
    test("positive: file attached: should return code 200", async () => {
      const buffer = await fs.readFile("./test/defimg.jpg");
      const res = await request(app)
        .patch(`/api/users/avatars`)
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", buffer, "defimg.jpg");
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });
    test("negative: no file attached: should return code 400", async () => {
      const buffer = null;
      const res = await request(app)
        .patch(`/api/users/avatars`)
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", buffer, "defimg.jpg");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      
    });
    test("negative: wrong MIME-type file attached: should return code 400", async () => {
      const buffer = await fs.readFile("./test/test.txt");
      const res = await request(app)
        .patch(`/api/users/avatars`)
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", buffer, "test.txt");
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      
    });
  });
  describe("Testing /api/users: update subscription", () => {
    test("positive: correct subscriptyion type: should return code 200", async () => {
      const res = await request(app)
        .patch(`/api/users`)
        .send({ subscription: "pro" })
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      
    });
    test("negative: incorrect subscription type: should return code 400", async () => {
      const res = await request(app)
        .patch(`/api/users`)
        .send({ subscription: "somethingIncorrect" })
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(400);
      expect(res.body).toBeDefined();
      
    });
  });
  describe("Testing /api/users/auth/logout", () => {
    test("positive: correct token: should return code 204", async () => {
      const res = await request(app)
        .post(`/api/users/auth/logout`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(204);
      expect(res.body).toBeDefined();
      
    });
  });
});
