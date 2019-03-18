import { MongoClient } from 'mongodb';

const connectionURI = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURI, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to mongodb');
  }

  const db = client.db(databaseName);

  db.collection('users').insertOne({
    name: 'Erik',
    age: 39
  });
});
