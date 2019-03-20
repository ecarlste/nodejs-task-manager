const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

beforeEach(async () => {
  console.log(process.env.MONGODB_URI);
  await User.deleteMany();
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
