import "./Loading.css";
import {HashLoader } from "react-spinners";
export const Loading = ({ massage }) => {
    

  return (
    <div id="spinner">
            <HashLoader color="black" size={45} loading={true} />
    </div>
  )
};
