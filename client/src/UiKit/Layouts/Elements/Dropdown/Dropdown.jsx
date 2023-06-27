import { useState } from "react";
import "./Dropdown.css";

export const Dropdown = (props) => {
  const [visible, setVisible] = useState(false);

  const HandleHeaderClick = () => {
    setVisible(!visible)
  }

  return (
    <div id={props.id} className="dropdown-container">
      <div className="dropdown-header" onClick={HandleHeaderClick}>
        {props.header}
      </div>
      {visible && (
        <div className="dropdown-list">
          {props.children}
        </div>
      )}
    </div>
  );
};
