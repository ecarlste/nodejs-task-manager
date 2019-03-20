/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'John',
  email: 'john@test.com',
  password: 'passtest',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SIGNING_KEY)
    }
  ]
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'tester',
      email: 'test@test.com',
      password: 'testpass'
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: 'tester',
      email: 'test@test.com'
    },
    token: user.tokens[0].token
  });

  expect(user.password).not.toBe('testpass');
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.tokens[1].token).toBe(response.body.token);
});

test('Should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'invalid@nologin.io',
      password: 'passtest'
    })
    .expect(401);
});

test('Should not login existing user with wrong password', async () => {
  await request(app)
    .post('/users/login')
    .send({ email: userOne.email, password: 'incorrect' })
    .expect(401);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Shold not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('Should allow user to upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpeg')
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
  await request(app)
    .put('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ name: 'Kevin' })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual('Kevin');
});

test('Should not update invalid user fields', async () => {
  await request(app)
    .put('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ _id: new mongoose.Types.ObjectId() })
    .expect(400);

  const user = await User.findById(userOneId);
  expect(user._id).toEqual(userOneId);
});
