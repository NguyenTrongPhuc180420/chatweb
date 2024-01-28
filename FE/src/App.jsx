import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import BoxChat from "./page/BoxChat";
import "./App.css";
import JoinRoom from "./page/JoinRoom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<JoinRoom />}></Route>
          <Route
            path="/box-chat/:roomId/:username"
            element={<BoxChat />}
          ></Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition:Bounce
          stacked
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
