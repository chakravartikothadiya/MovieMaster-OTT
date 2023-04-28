import React, { useEffect, useState } from "react";
import "../App.css";
function ChatRoom({ socket, username, room }) {
  const [currMessage, setcurrMessage] = useState("");
  const [messagelist, setMessagelist] = useState([]);
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
    setMessagelist([]);
  }, [room]);

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      //   console.log(data.author == username);
      if (data.author !== username) {
        // console.log(data.message);
        setMessagelist((list) => [...list, data]);
      }
    });
    return () => {
      socket.off("recieve_message");
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>{room} live chat</p>
        {/* <button onClick={closeChat}>close</button> */}
      </div>
      <div className="chat-body">
        {messagelist.map((messageContent) => {
          return (
            <div
              className={`message ${
                messageContent.author === username ? "right" : "left"
              }`}
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
        <input
          type="text"
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
