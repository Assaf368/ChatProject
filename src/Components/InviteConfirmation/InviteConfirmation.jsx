import "./InviteConfirmation.css";

export const InviteConfirmation = ({ username,handleAcception, handleRejection }) => {
 
    

  return (
    <div className="invite-confirmation-container">
      <div className="username-container">{username}</div>
      <div className="menu-btns-container">
        <button onClick={handleAcception} className="accept-btn">Accept</button>
        <button onClick={handleRejection} className="reject-btn">Reject</button>
      </div>
    </div>
  );
};
