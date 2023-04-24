import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "pages/Login";
import { Reg } from "pages/Reg";
import { Home } from "pages/Home";
import { ReduxProvider } from "State/store";


export const App = () => {
  return (
    <ReduxProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Reg />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>
        </Routes>
      </BrowserRouter>
    </ReduxProvider>
  );
};

export default App;
