/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const Task = require('../src/models/task');
const { setupDatabase, userOne } = require('./fixtures/db');
const app = require('../src/app');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ description: 'test description' })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});
