require('dotenv').config()
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secret_token = process.env.SECRET_TOKEN;

router.post('/', async (req, res) => {
    
  const user = req.body;
  let role = "user";
  const USERS = await db.collection('users').find({}).toArray();
  const ADMIN = await db.collection('admins').find({}).toArray();

  foundAdmin = ADMIN.find(x => x.email === user.email && x.password === user.password);
  foundUser = USERS.find(x => x.email === user.email);
  
  if(foundAdmin)
    role = "admin";
  if(foundUser) {
    if(foundUser.password === user.password){
      const token = jwt.sign({
        id: user.email,
        role: role,
      }, secret_token);
      res.status(200).json({token});
    }
    else {
      res.status(401).json({msg:"Incorrect Password"});
    }
  }
  else {
    res.status(401).send({msg:"User Not Found"});    
  }
});

module.exports = router;