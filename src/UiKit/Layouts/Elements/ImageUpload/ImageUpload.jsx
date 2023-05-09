import { useState } from "react";
import "./ImageUpload.css";
import axios from "axios";

export const ImageUpload = ({SetImage,id}) => {
 

  const HandleImage = (event) => {
    SetImage(event.target.files[0]);
  };

  return (
    <div id={id} className="image-upload-container">
      <input type="file"  id="file-input" onChange={HandleImage} />
    </div>
  );
};
