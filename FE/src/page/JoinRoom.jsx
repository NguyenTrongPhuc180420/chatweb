import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinRoom() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    roomId:null,
    username:null
  })
  return (
    <div>
      <p>Tham gia phong</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        action=""
        style={{
          width: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <input onChange={(e)=>{
          setForm({...form,roomId:e.target.value})
        }} type="text" name="room" placeholder="room id" />
        <input onChange={(e)=>{
          setForm({...form,username:e.target.value})
        }} type="text" name="username" placeholder="username" />
        <button
          type="submit"
          onClick={() => {
            navigate(`/box-chat/${form.roomId}/${form.username}`);
          }}
        >
          tham gia
        </button>
      </form>
    </div>
  );
}

export default JoinRoom;
