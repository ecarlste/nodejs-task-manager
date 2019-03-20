const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Task = require('../../src/models/task');
const User = require('../../src/models/user');

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

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'Chris',
  email: 'c2@test.com',
  password: 'elduderino',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SIGNING_KEY)
    }
  ]
};

const taskOneId = new mongoose.Types.ObjectId();
const taskOne = {
  _id: taskOneId,
  description: 'task one',
  completed: false,
  owner: userOneId
};

const taskTwoId = new mongoose.Types.ObjectId();
const taskTwo = {
  _id: taskTwoId,
  description: 'task two',
  completed: false,
  owner: userOneId
};

const taskThreeId = new mongoose.Types.ObjectId();
const taskThree = {
  _id: taskThreeId,
  description: 'task three',
  completed: true,
  owner: userTwoId
};

const setupDatabase = async () => {
  await User.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();

  await Task.deleteMany();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  setupDatabase,
  userOneId,
  userTwoId,
  userOne,
  userTwo,
  taskOneId,
  taskTwoId,
  taskThreeId,
  taskOne,
  taskTwo,
  taskThree
};
