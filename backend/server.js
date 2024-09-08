require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const homeRoute = require('./routes/home');
const {MongoClient} = require('mongodb')

function connectMongoDB() {
  const uri = process.env.MONGODB_URI
  const client = new MongoClient(uri);
  const db = client.db('CodeArena');
  return db;
}
const db = connectMongoDB();

global.db = db;

app.use(cors());
app.use(express.json());

app.use('/', homeRoute)
app.use('/login', loginRoute);
app.use('/register', registerRoute);

app.listen(port, '0.0.0.0',() => {
  console.log(`listening on port ${port}`)
})

module.exports = app;