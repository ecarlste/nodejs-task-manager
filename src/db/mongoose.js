import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
});

export const User = mongoose.model('User', {
  name: { type: String },
  age: { type: Number }
});

export const Task = mongoose.model('Task', {
  description: { type: String },
  completed: { type: Boolean }
});
