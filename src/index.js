import app from './app';

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}...`);
});
