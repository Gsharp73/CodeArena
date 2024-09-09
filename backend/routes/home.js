const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const databaseProblem = await db.collection('problems').find({}).toArray();
  res.json(databaseProblem);
})

router.post('/access', async (req, res) => {
  const user = await req.body.username;
  const ADMIN = await db.collection('admins').find({}).toArray();
  const foundAdmin = await ADMIN.find(x => x.email === user);
  if(foundAdmin){
    res.status(200).json({access: "admin"});
  }else{
    res.status(200).json({access: "user"});
  }
})

module.exports = router;