require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Friend = require("../models/Friend");
const {states} = require('../Enums/enums')


const jwt = require("jsonwebtoken");
const { FindByUserNameAsync, FindAllFrirndsDataAsync, CreateRoomAsync, FindFriendsForUserAsync, FindGroupsForUserAsync } = require("../DataBaseFuncs/functions");

function authenticateToken(req, res, next) {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

router.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
      userName: username,
      password: hashPassword,
    });
    await user.save();
    res.json({
      success: true,
      message: "User account created successfully.",
      username: username,
    });
  } else {
    res.json({
      success: false,
      message: "failed!.",
    });
  }
});


router.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const user = await User.findOne({ userName: username });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);

      if (validPassword) {
        const now = Math.floor(Date.now() / 1000);
        const payload = {
          userId: user.id,
          userName: user.userName,
          iat: now,
        };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: 900,
        });

        res.json({
          auth: true,
          accessToken: accessToken,
          res: user,
        });
      }
    } else {
      res.json({
        success: false,
        message: "User authentication failed!.",
      });
    }
  }
});

router.post('/api/home/accepted', async (req,res)=>{
  const {senderUsername} = req.body; 
  const {targetUsername} = req.body; 
  const sender = await FindByUserNameAsync(senderUsername);
  const target = await FindByUserNameAsync(targetUsername);
  const friendInstance = await Friend.findOne({sender:sender.id,target:target.id});
  friendInstance.isApproved = states.accepted;
   await friendInstance.save();
    res.sendStatus(200);
});

router.post('/api/home/rejected', async (req,res)=>{
  const {senderUsername} = req.body; 
  const {targetUsername} = req.body; 
  const sender = await FindByUserNameAsync(senderUsername);
  const target = await FindByUserNameAsync(targetUsername);
  const friendInstance = await Friend.findOne({sender:sender.id,target:target.id});
  friendInstance.isApproved = states.rejected;
   await friendInstance.save();
   res.sendStatus(200);
});

// router.post('/api/home/createroom', async(req,res)=>{
//   const {usernames,roomName, desc, img} = req.body;
//   await CreateRoomAsync(usernames,roomName,desc,img);
//   res.sendStatus(200);
// })


router.get("/api/home", authenticateToken, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt.decode(token);
  const username = decodedToken.userName;
  const id = decodedToken.userId
  
  res.json({
    success: true,
    message: " you'r fine!.",
    username: username,
    id: id
  });
});

router.get('/api/home/friendsdata',async(req,res) =>{
  const userName = req.query.username;
  const friends = await FindFriendsForUserAsync(userName);
  const roomsForShow = await FindGroupsForUserAsync(userName);
  const data = {
    friends:friends,
    roomsForShow:roomsForShow
  }
  res.send(data);
});

router.get('/api/home/getfullchat', async(req,res)=>{
  
})


router.get("/api/findOne", async (req,res) =>{
  const userName = req.query.username;
  const user = await User.findOne({
    userName:userName,
  }).catch(err => res.send(err));
  if(!user)
  {
    res.json({
      username:null,
      massage: "couldnt find one!"
    });
  }
  else
  {
    res.json({
      username:user.userName,
      id: user.id,
      massage: "success!"
    });
  }
});


module.exports = router;
