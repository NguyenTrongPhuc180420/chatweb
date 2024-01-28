import React, { useEffect, useMemo, useRef, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  ConversationHeader,
  VoiceCallButton,
  VideoCallButton,
  EllipsisButton,
  TypingIndicator,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import { io } from "socket.io-client";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
function BoxChat() {
  const { roomId, username } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef();
  const [message, setMessage] = useState("");
  const [listUser, setListUser] = useState([]);
  const [listMessage, setListMessage] = useState([
    {
      message: "hello",
      createAt: "12",
      username,
    },
    {
      message: "hello",
      createAt: "12",
      username: "Long",
    },
  ]);
  const [name, setName] = useState("");
  const socket = useMemo(() => io("http://localhost:3000"), [false]);
  const handleChange = (value) => {
    setMessage(value);
  };
  const handleSendMessage = (value) => {
    const checkBadWord = () => {
      console.log("gui tin nhan thanh cong");
    };
    try {
      socket.emit("send-massage-to-server", { message: value }, checkBadWord);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    socket.emit("join-room", { roomId, username });
    //welcome user
    socket.on("send-welcome-message-to-client", async (data) => {
      toast("🦄 " + data.message);
      setName(data.roomId);
    });
    //send message
    socket.on("send-message-to-client", (data) => {
      setListMessage((oldArr) => [...oldArr, data]);
      console.log(data, "newdata");
    });
    //send location
    socket.on("send-location-to-client", (data) => {
      setListMessage((oldArr) => [...oldArr, data]);
    });
    //send list user
    socket.on("send-list-user", (data) => {
      console.log(data);
      setListUser(data.listUser);
    });

    //user disconnect
    socket.on("user-disconnect", (data) => {
      toast.warn(`Người dùng ${data} đã rời khỏi phòng`);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div style={{}}>
      <div style={{ height: "500px" }}>
        <MainContainer>
          <Sidebar position="left" scrollable={false}>
            <Search placeholder="Search..." />
            <ConversationList>
              {listUser.map((item, idx) => (
                <Conversation
                  key={idx}
                  name={item.username}
                  lastSenderName="Lilly"
                  info="Yes i can do it for you"
                >
                  <Avatar
                    src={
                      "https://plus.unsplash.com/premium_photo-1664457233888-523931beef03?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    name="Lilly"
                    status="available"
                  />
                </Conversation>
              ))}
              {/* <Conversation
                name="Lilly"
                lastSenderName="Lilly"
                info="Yes i can do it for you"
              >
                <Avatar
                  src={
                    "https://plus.unsplash.com/premium_photo-1664457233888-523931beef03?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  name="Lilly"
                  status="available"
                />
              </Conversation>

              <Conversation
                name="Joe"
                lastSenderName="Joe"
                info="Yes i can do it for you"
              >
                <Avatar
                  src={
                    "https://plus.unsplash.com/premium_photo-1664457233888-523931beef03?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  name="Joe"
                  status="dnd"
                />
              </Conversation> */}
            </ConversationList>
          </Sidebar>
          <ChatContainer>
            <ConversationHeader>
              <ConversationHeader.Back />
              <Avatar
                src={
                  "https://plus.unsplash.com/premium_photo-1664457233888-523931beef03?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                name="Zoe"
              />
              <ConversationHeader.Content
                userName={name}
                info="Active 10 mins ago"
              />
              <ConversationHeader.Actions>
                <VoiceCallButton />
                <VideoCallButton />
                <EllipsisButton orientation="vertical" />
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList
              typingIndicator={<TypingIndicator content="Zoe is typing" />}
            >
              {/* <MessageSeparator content="Saturday, 30 November 2019" /> */}
              {listMessage.map((mes, idx) => (
                <Message
                  key={idx}
                  model={{
                    message: mes.message,
                    sentTime: mes.createAt,
                    sender: mes.username,
                    direction:
                      mes.username == username ? "outgoing" : "incoming",
                    position: "single",
                  }}
                >
                  <Avatar
                    src={
                      "https://plus.unsplash.com/premium_photo-1664457233888-523931beef03?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    name="Zoe"
                  />
                </Message>
              ))}
            </MessageList>
            <MessageInput
              onChange={handleChange}
              ref={inputRef}
              value={message}
              onAttachClick={() => {
                navigator.geolocation.getCurrentPosition((location) => {
                  const { latitude, longitude } = location.coords;
                  socket.emit("send-location-to-server", {
                    latitude,
                    longitude,
                  });
                });
              }}
              onSend={handleSendMessage}
              placeholder="Type message here"
            />
          </ChatContainer>
        </MainContainer>
        <button
          onClick={() => {
            navigate("/room");
          }}
        ></button>
      </div>
    </div>
  );
}

export default BoxChat;
