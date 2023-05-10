const Room = require("../models/Room");
const { GetUserAsync, GetUsersByUsernamesAsync } = require("./UserFunctions");



const _GetPreviewGroupsAsync = async (user) => {
    const previewGroups = await Room.find({ 'members.id': user.id })
    .select( "_id name img members").lean().then((rooms)=>{
        return rooms.map((room)=>{
          const member = room.members.find(member=> member.id.toString() === user.id );
          let roomName = null;
          let img = null;
          if(room.name === null){
            roomName = room.members.find(member => member.username !== user.userName).username;
            img = room.members.find(member => member.username !== user.userName).image;
          }else{
            roomName = room.name;
            img = room.img
          }
          return {
            _id: room._id,
            name: roomName,
            img: img,
            unreadMassagesCounter: member.unreadMassagesCounter          
          }
        })
      })
  
    return previewGroups;
  };
  
  const _GetGroupsAsync = async(user)=>{
    const groups = await Room.find({'members.id': user.id });
    return groups;
  }
  
  const FindPreviewGroupsForUserAsync = async (username) => {
    const user = await GetUserAsync(username);
    let previewGroups = null;
    if (user) {
      previewGroups = await _GetPreviewGroupsAsync(user);
    } 
    return previewGroups;
  };
  
  const FindGroupsForUserAsync = async(username)=>{
    const user = await GetUserAsync(username);
    let groups = null;
    if (user) {
      groups = await _GetGroupsAsync(user);
    } 
    return groups;
  }
  
  
  const _SaveRoomToDbAsync = async(users ,roomName, desc,img)=>{
    const nowTime = new Date();
    const members = users.map((user) =>{
      return{id:user.id,username: user.userName, unreadMassagesCounter:0}  
    } );
    const room = new Room({
      members: members,
      name: roomName,
      description: desc,
      img: img,
      date: nowTime,
      massages: [],
      unreadMassagesCounter: 0
    });
    await room.save();
  }

  const CreateRoomAsync = async (usernames, roomName, desc, img) => {
    const users = await GetUsersByUsernamesAsync(usernames);
    if (users) {
       await _SaveRoomToDbAsync(users, roomName,desc,img);
    }
  };

  const CreatePrivateRoomAsync = async(usernames,roomName)=>{
    const users = await GetUsersByUsernamesAsync(usernames);
    const img = null
    const desc = null
    if(users){
       await _SaveRoomToDbAsync(users, roomName,desc,img);
    }
  }


  module.exports = {
    CreateRoomAsync,
    FindPreviewGroupsForUserAsync,
    FindGroupsForUserAsync,
    CreatePrivateRoomAsync,
  }