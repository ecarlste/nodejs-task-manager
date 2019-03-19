import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useCreateIndex: true
});
