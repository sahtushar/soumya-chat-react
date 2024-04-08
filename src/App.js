import "./App.css"; // Import CSS file for styling

import React, { useEffect, useRef, useState } from "react";

import io from "socket.io-client";

const socket = io("https://soumy-chat-app.netlify.app", {
  withCredentials: true,
});

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const asked = useRef(false);
  useEffect(() => {
    if (!asked.current) {
      asked.current = true;
      getUsername();
    }
  }, []);

  const getUsername = () => {
    const name = window.prompt("Please enter your username:");
    if (name && name.trim() !== "") {
      setUsername(name.trim());
    } else {
      // If username is not provided, prompt again
      getUsername();
    }
  };

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      socket.emit("message", { username, message: input }); // Include username with message
      setInput("");
    }
  };

  return (
    <div className="container">
      <h1>Soumya Chat App</h1>
      {username ? <p>{username}</p> : <></>}
      <div className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.username === username ? "my-message" : "other-message"
            }
          >
            <strong>{message.username}: </strong>
            {message.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
