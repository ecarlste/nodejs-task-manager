const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
  name: 'John',
  email: 'john@test.com',
  password: 'passtest'
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test('Should signup a new user', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'tester',
      email: 'test@test.com',
      password: 'testpass'
    })
    .expect(201);
});

test('Should login existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
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
