const { states } = require("../Enums/enums");
const FriendshipRequest = require("../models/Friend");
const User = require("../models/User");
const Room = require("../models/Room");

const GetUserAsync = async (username) => {
  const user = await User.findOne({ userName: username }).catch((err) =>
    console.log(err)
  );
  return user;
};

const SendInvitationAsync = async (senderId, targetId) => {
  const friendInstance = await FriendshipRequest.findOne({
    sender: senderId,
    target: targetId,
  }).populate("sender target");
  if (!friendInstance) {
    const friend = new FriendshipRequest({
      sender: senderId,
      target: targetId,
      isApproved: states.waiting,
    });
    await friend.save();
  }
};

const _GetAcceptedFriendshipRequestsAsync = async (user) => {
  const friendshipRequests = await FriendshipRequest.find({
    $or: [{ sender: user.id }, { target: user.id }],
    isApproved: states.accepted,
  }).populate("sender target");

  return friendshipRequests;
};


const _GetFriendFromRequest = async (user, friendshipRequest) => {
  let friend = null
  const targetId = friendshipRequest.target._doc._id.toString()
  const senderId = friendshipRequest.sender._doc._id.toString()

  if (targetId === user.id) {
    friend = User.findById(senderId);
  } else {
    friend =  User.findById(targetId);
  }
  
  return friend
}

const Stam = ()=>{
  
}
const _GetFriendFromRequestsAsync = async (user, friendshipRequests) => {
  const friendsPromises = friendshipRequests.map((friendshipRequst) => {
    return _GetFriendFromRequest(user, friendshipRequst)
  });

  return await Promise.all(friendsPromises);
}

const _GetFriendsAsync = async (user) => {
  let friends = null
  const acceptedFriendshipRequests = _GetAcceptedFriendshipRequestsAsync(user);

  if (acceptedFriendshipRequests) {
    friends = _GetFriendFromRequestsAsync(user, acceptedFriendshipRequests)
  }

  return friends
}

const FindUserFriendsAsync = async (username) => {
  const user = await GetUserAsync(username);
  let friends = null
  
  if (user) {
    friends = _GetFriendsAsync(user)
  } 
  return friends
};

const FindGroupsForUserAsync = async (username) => {
  const user = await GetUserAsync(username);
  if (user) {
    const roomsPromises = Room.find({ members: { $in: [user.id] } }).select(
      "_id name img"
    );
    const roomsForShow = await Promise.resolve(roomsPromises);
    if (roomsForShow) {
      return roomsForShow;
    }
    return null;
  } else {
    return null;
  }
};

const GetFullChatDetails = async (roomId) => {
  return await Room.findById(roomId);
}

const CreateRoomAsync = async (usernames, roomName, desc, img) => {
  const usersPromises = usernames.map(async (username) => {
    return GetUserAsync(username);
  });
  const users = await Promise.all(usersPromises);
  if (users) {
    const nowTime = new Date();
    const ids = users.map((user) => user.id);
    const room = new Room({
      members: ids,
      name: roomName,
      description: desc,
      img: img,
      date: nowTime,
      massages: null,
    });
    await room.save();
    const resObj = {
      roomId: room.id,
      massages: room.massages,
      date: room.date,
    };
    return resObj;
  }
};
module.exports = {
  FindByUserNameAsync: GetUserAsync,
  SendInvitationAsync,
  FindFriendsForUserAsync: FindUserFriendsAsync,
  CreateRoomAsync,
  FindGroupsForUserAsync,
};
