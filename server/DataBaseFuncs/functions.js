const { states } = require("../Enums/enums");
const FriendshipRequest = require("../models/Friend");
const User = require("../models/User");
const Room = require("../models/Room");
const Massage = require("../models/Massage");

const GetUserAsync = async (username) => {
  const user = await User.findOne({ userName: username }).catch((err) =>
    console.log(err)
  );
  return user;
};

const CheckFriendshipStatusAsync = async(senderId,targetId)=>{
  const friendInstance = await FriendshipRequest.findOne({
    $or: [
      {
        sender: senderId,
        target: targetId,
      },
      {
        sender: targetId,
        target: senderId,
      },
    ],
  })
  if(friendInstance){
    return friendInstance.isApproved;
  }
    return false;
}

const AddInvitationToDbAsync = async (senderId, targetId) => {
    const friend = new FriendshipRequest({
      sender: senderId,
      target: targetId,
      isApproved: states.waiting,
    });
    await friend.save();
};

const _GetPreviewInvitationsAsync = async(invitations)=>{
  const usersPromises =  invitations.map((invitation)=>{
    const sender =  User.findById(invitation.sender);
    return sender
  })
  const users = await Promise.all(usersPromises);
  return users.map((user)=>{
      return {sender:user.userName}
  } );

}

const GetUserInvitationsAsync = async(username) =>{
  const user = await GetUserAsync(username);
  const invitations = await FriendshipRequest.find({
    target:user.id,
    isApproved: states.waiting
  })
  const previewInvitations = await _GetPreviewInvitationsAsync(invitations);
  return previewInvitations;
}

const _GetAcceptedFriendshipRequestsAsync = async (user) => {
  const friendshipRequests = await FriendshipRequest.find({
    $or: [{ sender: user.id }, { target: user.id }],
    isApproved: states.accepted,
  }).populate("sender target");

  return friendshipRequests;
};

const _GetFriendFromRequest = async (user, friendshipRequest) => {
  let friend = null;
  const targetId = friendshipRequest.target._doc._id.toString();
  const senderId = friendshipRequest.sender._doc._id.toString();

  if (targetId === user.id) {
    friend = User.findById(senderId);
  } else {
    friend = User.findById(targetId);
  }
  return friend;
};

const _GetFriendFromRequestsAsync = async (user, friendshipRequests) => {
  const friendsPromises = friendshipRequests.map((friendshipRequst) => {
    return _GetFriendFromRequest(user, friendshipRequst);
  });
  return await Promise.all(friendsPromises);
};

const _GetFriendsAsync = async (user) => {
  let friends = null;
  const acceptedFriendshipRequests = await _GetAcceptedFriendshipRequestsAsync(user);

  if (acceptedFriendshipRequests) {
    friends = _GetFriendFromRequestsAsync(user, acceptedFriendshipRequests);
  }

  return friends;
};

const FindUserFriendsAsync = async (username) => {
  const user = await GetUserAsync(username);
  let friends = null;

  if (user) {
    friends = _GetFriendsAsync(user);
  }
  return friends;
};

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
  return room;
}

const ResetUnreadMassagesCounterAsync = async(roomId,userId)=>{
  const room = await Room.findById(roomId);
  if(room){
    const member = room.members.find(member=> member.id.toString() === userId);
    if(member){
      member.unreadMassagesCounter = 0;
      await room.save();
    }
  }
}

const UpdateUnreadMassagesCounterAsync = async(roomId ,userId, count)=>{
  const room = await Room.findById(roomId);
  if(room){
    const member = await room.members.find(member=> {return member.id.toString() === userId});
    if(member){
      if(count !== undefined){
        member.unreadMassagesCounter = count;
      }else{
        member.unreadMassagesCounter++;
      }
      await room.save();
    }
  }
}

const GetUsersByUsernamesAsync = async(usernames)=>{
  const usersPromises = usernames.map(async (username) => {
    return GetUserAsync(username);
  });
   return await Promise.all(usersPromises);
}

const UpdateMassageToDbAsync = async(text , targetRoom, senderUser)=>{
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }).toString();
  const massage = new Massage({
    text: text,
    date: time,
    name: senderUser.userName,
    sender: senderUser.id,
    target: targetRoom
  });
  await massage.save();
  const room = await Room.findById(targetRoom);
  room.massages.push(massage.id);
  await room.save();
}

const GetUsersByIdsAsync = async(ids)=>{
  const usersPromises =  ids.map((id)=>{
    return  User.findById(id);
  })
  return await Promise.all(usersPromises);
}

const CreateRoomAsync = async (usernames, roomName, desc, img) => {
  const users = await GetUsersByUsernamesAsync(usernames);
  if (users) {
    const room = await _SaveRoomToDbAsync(users, roomName,desc,img);
  }
};

const CreatePrivateRoomAsync = async(usernames,roomName)=>{
  const users = await GetUsersByUsernamesAsync(usernames);
  const img = null
  const desc = null
  if(users){
    const room = await _SaveRoomToDbAsync(users, roomName,desc,img);
  }
}


module.exports = {
  GetUserAsync,
  AddInvitationToDbAsync,
  FindUserFriendsAsync,
  CreateRoomAsync,
  FindPreviewGroupsForUserAsync,
  FindGroupsForUserAsync,
  GetUsersByUsernamesAsync,
  ResetUnreadMassagesCounterAsync,
  UpdateUnreadMassagesCounterAsync,
  GetUsersByIdsAsync,
  UpdateMassageToDbAsync,
  GetUserInvitationsAsync,
  CheckFriendshipStatusAsync,
  CreatePrivateRoomAsync
};
