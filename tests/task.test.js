/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const Task = require('../src/models/task');
const { setupDatabase, taskOneId, userOne, userTwo } = require('./fixtures/db');
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

test('Should return tasks for user', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
});

test('User should not be able to delete task they do not own', async () => {
  await request(app)
    .delete(`/tasks/${taskOneId}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOneId);
  expect(task).not.toBeNull();
});
