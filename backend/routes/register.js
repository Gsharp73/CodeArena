const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  console.log("here");
  const user = req.body;
  const USERS = await db.collection('users').find({}).toArray();
  const userCollection = db.collection('users');
  
  foundUser = USERS.find(x => x.email === user.email);
  if(foundUser){
    return res.status(409).send({msg:"user already exists"});
  }
  
  userCollection.insertOne(user);
  return res.status(200).send('successful');
});

module.exports = router;
