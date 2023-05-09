require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Friend = require("../models/Friend");
const Room = require("../models/Room");
const {states} = require('../Enums/enums')
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path')
const { ResetUnreadMassagesCounterAsync, UpdateUnreadMassagesCounterAsync, FindPreviewGroupsForUserAsync, GetUsersByIdsAsync, GetUserInvitationsAsync, FindUserFriendsAsync, GetUserAsync, CheckFriendshipStatusAsync, CreateRoomAsync, CreatePrivateRoomAsync, UpdateUserStatusAsync, UpdateUserImgAsync } = require("../DataBaseFuncs/functions");



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the upload folder path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the filename to be the current date + file extension
  }
});
 const upload = multer({ storage: storage });






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

router.post('/api/home/updateprofile',upload.single('image'), async(req,res)=>{
  const{username,status} = req.body;
  let img = null;
  if(req.file){
     img = req.file.path;
  }
  if(status !== ''){
    await UpdateUserStatusAsync(username,status);
  }
  if(img){
    await UpdateUserImgAsync(username, img);
  }
})

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
          status:user.status,
          img:user.image,
          iat: now,
        };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: 240 * 60,
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
  const sender = await GetUserAsync(senderUsername);
  const target = await GetUserAsync(targetUsername);
  const friendInstance = await Friend.findOne({sender:sender.id,target:target.id});
  friendInstance.isApproved = states.accepted;
   await friendInstance.save();
    res.sendStatus(200);
});

router.post('/api/home/rejected', async (req,res)=>{
  const {senderUsername} = req.body; 
  const {targetUsername} = req.body; 
  const sender = await GetUserAsync(senderUsername);
  const target = await GetUserAsync(targetUsername);
  const friendInstance = await Friend.findOne({sender:sender.id,target:target.id});
  friendInstance.isApproved = states.rejected;
   await friendInstance.save();
   res.sendStatus(200);
});

router.post('/api/home/createroom',upload.single('image'), async (req,res)=>{
  const {usernames,groupName, desc} = req.body;
  let usernamesArray = null;
  usernamesArray = usernames
  if(!Array.isArray(usernames))
    usernamesArray = usernames.split(',');
  let img = null;
  if(req.file)
    img = req.file.path;
  
      if(usernames.length !== 2){
          await CreateRoomAsync(usernamesArray,groupName,desc,img);
      }else{
          await CreatePrivateRoomAsync(usernamesArray,groupName);
      }
});

router.post('/api/home/resetUnreadMassagesCounter', async(req,res)=>{
  const {roomId,userId} = req.body.params;
  await ResetUnreadMassagesCounterAsync(roomId,userId);
  res.sendStatus(200);
})

router.post('/api/home/updateUnreadMassagesCounter', async(req,res)=>{
  const {roomId,userId, count} = req.body;
  await UpdateUnreadMassagesCounterAsync(roomId,userId,count);
  res.sendStatus(200);
})

router.get("/api/home", authenticateToken, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt.decode(token);
  const user = await GetUserAsync(decodedToken.userName);
  res.json({
    success: true,
    message: " you'r fine!.",
    username: decodedToken.userName,
    id: decodedToken.userId,
    status: user.status,
    img:user.image
  });
});

router.get('/api/home/friendsdata',async(req,res) =>{
  const userName = req.query.username;
  const friends = await FindUserFriendsAsync(userName);
  const roomsForShow = await FindPreviewGroupsForUserAsync(userName);
  roomsForShow.forEach((room)=>{
    room.img = `http://localhost:5000/${room.img}`
  })
  const invitations =  await GetUserInvitationsAsync(userName);
  const data = {
    friends:friends,
    roomsForShow:roomsForShow,
    invitations:invitations
  }
  res.send(data);
});

router.get('/api/home/getfullchat', async(req,res)=>{
  const roomId = req.query.roomId;
  const chat = await Room.findById(roomId).populate('members massages');
  chat.img = `http://localhost:5000/${chat.img}`
  const data = {
    chat : chat
  }
  res.send(data);
})


router.get("/api/findOne", async (req,res) =>{
  const {username, senderId} = req.query;
  const targetUser = await GetUserAsync(username);
  if(!targetUser)
  {
    res.json({
      username:null,
      massage: "couldnt find one!"
    });
    return res.status(200);
  }
  let friendshipStatus = await CheckFriendshipStatusAsync(senderId,targetUser.id);
  if(friendshipStatus === states.accepted){
    res.json({
      username:targetUser.userName,
        massage: "already friends!",
        imgUrl: targetUser.image,
        desc: targetUser.desc
    })
    return res.status(200);
  }if(friendshipStatus === states.waiting){
    res.json({
      username:targetUser.userName,
        massage: "still waiting"
    })
    return res.status(200);
  }
  if(friendshipStatus === false || friendshipStatus === states.rejected)
  {
    res.json({
      username:targetUser.userName,
      massage: "success!"
    });
    return res.status(200);
  }
  
  
});


module.exports = router;
