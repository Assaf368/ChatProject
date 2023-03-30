require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User')
const jwt = require('jsonwebtoken');


function authenticateToken(req,res,next){
    const token = req.headers['accesstoken'];
    if(token == null)
    {
        return res.sendStatus(401)
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if(err)
        {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })

}


router.post('/api/register',async (req,res)=>{
    const {username , password} = req.body
    if(username && password)
    {
      const hashPassword = await bcrypt.hash(password,12);
      const user = new User({
          userName:username,
          password:hashPassword
      });
      await user.save();
      res.json({
        "success": true,
        "message": "User account created successfully.",
        "username": username
      });
    }
    else{
        res.json({
          "success": false,
          "message": "failed!."
        })
    }
});

router.post('/api/login',async (req,res) =>{
    const {username , password} = req.body
    if(username && password){
        const user = await User.findOne({userName: username});
        if(user)
        {
         const validPassword = await bcrypt.compare(password, user.password);
        
             if(validPassword)
             {
              const payload = {
              userId: user._id,
              userName: user.userName
                };
              const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{expiresIn: 300});
              res.json({
                  auth:true,
                  accessToken :accessToken,
                  res:user
              });
         }
       }
        else
        {
            res.json({
                "success": false,
                "message": "User authentication failed!.",
            });
        }
    }
});

router.get('/api/home',authenticateToken, async(req,res) =>{
    res.json({
        "success": true,
        "message": " you'r fine!!.",
    })
});



module.exports = router;