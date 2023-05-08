import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

function ChatRoom({
  socket,
  username,
  room,
  closeChat,
  setCloseChat,
  setChatclosecounter,
  chatclosecounter,
  setisChatOn,
}) {
  const [currMessage, setcurrMessage] = useState("");
  const [messagelist, setMessagelist] = useState([]);
  const navigate = useNavigate;
  //   let currentRoom = room;
  const sendMessage = async () => {
    if (currMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("message", messageData);
      setMessagelist((list) => [...list, messageData]);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("session_auth") == null) {
      navigate("/login", { state: { session_expired: true } });
    }
  }, [localStorage.getItem("session_auth"), currMessage]);

  useEffect(() => {
    setMessagelist([]);
  }, [room]);

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      if (data.author !== username) {
        setMessagelist((list) => [...list, data]);
      }
    });
    return () => {
      socket.off("recieve_message");
    };
  }, [socket]);

  const closeChatfun = async () => {
    setCloseChat(true);
    setisChatOn(false);
    setChatclosecounter(chatclosecounter + 1);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>{room} live chat</p>
        {/* <button onClick={closeChat}>close</button> */}
        <button className="close-button" onClick={closeChatfun}>
          ×
        </button>
      </div>
      <div className="chat-body">
        {messagelist.map((messageContent, i) => {
          return (
            <div
              className={`message ${
                messageContent.author === username ? "right" : "left"
              }`}
              key={i}
            >
              <div className="message-content">
                <p>{messageContent.message}</p>
              </div>
              <div className="message-details">
                <p>
                  {messageContent.author} • {messageContent.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chat-input">
        <label for="chat-input" hidden></label>
        <input
          type="text"
          id="chat-input"
          placeholder="Hey...."
          onChange={(e) => {
            setcurrMessage(e.target.value);
          }}
          value={currMessage}
        />
        <button
          onClick={() => {
            sendMessage();
            setcurrMessage("");
          }}
        >
          &#9658;
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
