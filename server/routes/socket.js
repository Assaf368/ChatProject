const { Server } = require("socket.io");
const { use } = require("./handler");
const {
  SendInvitationAsync,
  FindByUserNameAsync,
  CreateRoomAsync,
  FindGroupsForUserAsync,
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
      const resObj =  await CreateRoomAsync(usernames,roomName,desc,img);

      const res = {
        usernames:usernames,
        roomName:roomName,
        desc:desc,
        img:img,
        roomId:resObj.roomId,
        massages: resObj.massages,
        date: resObj.date
      };

      const userPromises = usernames.map((user) => {
        return FindByUserNameAsync(user);
      });
      const users = await Promise.all(userPromises);

      users.forEach((user) => {
        if (user.isOnline) {
          if(!user.socketId === socket.id){
            socket.to(user.socketId).emit("create_room_client", res);
            user.socketId.join(resObj.roomId);
          }
          else{
            io.to(user.socketId).emit("create_room_client", res);
            socket.join(resObj.roomId);
          }
        }
      });
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
