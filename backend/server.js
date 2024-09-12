require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT
const accessRoute = require('./routes/access');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const problemsRoute = require('./routes/problems');
const blogsRoute = require('./routes/blogs');
const {MongoClient} = require('mongodb')
const problemRoute = require('./routes/problem');
const createProblemRoute = require('./routes/createproblem');
const createBlogRoute = require('./routes/createblog');
const testprobRoute = require('./routes/testprob');

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

app.use('/access', accessRoute) 
app.use('/problems', problemsRoute)
app.use('/blogs', blogsRoute)
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/problem', problemRoute);
app.use('/createproblem', createProblemRoute);
app.use('/createblog', createBlogRoute);
app.use('/testing', testprobRoute);

const PORT = port || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;