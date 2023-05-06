const { Server } = require("socket.io");
const {
  SendInvitationAsync,
  FindByUserNameAsync,
  CreateRoomAsync,
  FindGroupsForUserAsync,
  GetUsersByIdsAsync,
  UpdateUnreadMassagesCounterAsync,
  UpdateMassageToDbAsync,
} = require("../DataBaseFuncs/functions");
const User = require("../models/User");


// Export the function that creates the io object
module.exports = (server) => {
  const io = new Server(server, {
    cors: "http://localhost:3000",
    methods: ["POST", "GET"],
  });

  io.on("connection", (socket) => {
    console.log(`user connected :${socket.id}`);

    socket.on("login", async (data) => {
      const user = await FindByUserNameAsync(data.username);
      if (user) {
        user.isOnline = true;
        user.socketId = socket.id;
        await user.save();

        const rooms = await FindGroupsForUserAsync(user.userName);
        rooms.forEach((room) => {
          socket.join(room.id);
        });
      }
    });

    socket.on("send_invitation", async (data) => {
      const targetUser = await FindByUserNameAsync(data.targetUsername);
      const senderUser = await FindByUserNameAsync(data.senderUsername);

      if (targetUser && senderUser) {
        if (targetUser.isOnline) {
          socket
            .to(targetUser.socketId)
            .emit("receive_invitation", data.senderUsername);
          await SendInvitationAsync(senderUser.id, targetUser.id);
        } else {
          await SendInvitationAsync(senderUser.id, targetUser.id);
        }
      }
    });

    socket.on("create_room", async (data) => {
      const {usernames,roomName, desc, img} = data;
      const roomId =  await CreateRoomAsync(usernames,roomName,desc,img);
      const userPromises = usernames.map((user) => {
        return FindByUserNameAsync(user);
      });
      const users = await Promise.all(userPromises);
      users.forEach((user) => {
        if (user.isOnline) {
          if(!user.socketId === socket.id){
            user.socketId.join(roomId);
          }
          else{
            socket.join(roomId);
          }
        }
      });
    });

    socket.on("send_massage", async (data) => {
      const { roomId,members,text,senderId} = data;
      const ids = members.map((member)=> {return member.id});
      const users = await GetUsersByIdsAsync(ids); 
      const senderUser = await User.findById(senderId);
      const resData = {
        roomId:roomId,
        text:text,
        senderId:senderId,
        username: senderUser.userName
      }
      io.to(roomId).emit('receive_message', resData);
      users.forEach(async(user)=>{
        if(!user.isOnline){
          await UpdateUnreadMassagesCounterAsync(roomId, user.id);
        }
      })
      await UpdateMassageToDbAsync(text,roomId, senderUser);
    });



    socket.on("logout", async (data) => {
      const user = await FindByUserNameAsync(data.username);
      user.isOnline = false;
      user.socketId = null;
      await user.save();
    });

    socket.on("disconnect", async() => {
      const user = await User.findOne({socketId:socket.id})
      if(user){
        user.isOnline = false;
        user.socketId = null;
        await user.save();
      }
      console.log(`User disconnected : ${socket.id}`);
    });
  });

  return { io };
};
