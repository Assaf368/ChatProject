import "./FriendSelector.css";
import produce from "immer";

export const FriendSelector = ({ username, SetUsernames}) => {
  const HandleCheckboxDiv = (event) => {
    const friendDiv = event.currentTarget;
    const checkbox = friendDiv.querySelector("input");
    if (event.target.className !== "checkbox") {
      checkbox.checked = !checkbox.checked;
    }
    if (checkbox.checked) {
      SetUsernames((usernames) =>
        produce(usernames, (draft) => {
          draft.push(username);
        })
      );
    } else {
      SetUsernames((usernames) =>
        produce(usernames, (draft) => {
          return draft.filter((name) => name !== username);
        })
      );
    }
  };

  return (
    <div onClick={HandleCheckboxDiv} className="friend-selector-container">
      <div className="friend-selector-img-container">
        <img src="" alt="img" className="friend-selector-img" />
      </div>
      <div className="friend-selector-username-container">{username}</div>
      <div className="friend-selector-checkbox-container">
        <input className="checkbox" type="checkbox" />
      </div>
    </div>
  );
};
