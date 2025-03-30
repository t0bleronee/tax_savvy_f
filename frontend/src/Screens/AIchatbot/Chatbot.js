import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { marked } from "marked";

import Navbar from '../../Components/Navbar';
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/history");
        setMessages(res.data.chat_history || []);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    chatWindowRef.current?.scrollTo(0, chatWindowRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const newMessages = [...messages, { text: trimmedInput, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", { message: trimmedInput });

      console.log(res.data);

      const botResponse = marked(res.data.response);
      setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Error connecting to server:", error);
      setMessages([...newMessages, { text: "Error connecting to server.", sender: "bot" }]);
    }
  };

  return (
    <div>
      <Navbar />
    <div className={`page-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="content-box">
        <div className="header">
          <h2 className="title">CHAT WITH AI</h2>
          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span className="slider"></span>
          </label>
        </div>

        <div ref={chatWindowRef} className="chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.sender === "user" ? "user-message" : "bot-message"}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          ))}
        </div>

        <div className="input-container">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Need help? I'm here to assist"
          />
          <button className="send-button" onClick={sendMessage}>
            ➤
          </button>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(to bottom right, #4FD1A5, #A8D8D3);
          padding: 20px;
          font-family: 'EB Garamond', serif;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background 0.3s;
        }

        .dark-mode {
          background: #1e1e1e;
          color: white;
        }

        .content-box {
          max-width: 700px;
          width: 100%;
          background: white;
          border-radius: 20px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          padding: 30px;
          transition: background 0.3s, color 0.3s;
        }

        .dark-mode .content-box {
          background: #2b2b2b;
          color: white;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          position: relative;
        }

        .title {
          font-size: 28px;
          font-weight: bold;
          color: #217A5D;
          text-align: center;
          flex: 1;
        }

        .dark-mode .title {
          color: #4FD1A5;
        }

        /* Toggle Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 20px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 4px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #4FD1A5;
        }

        input:checked + .slider:before {
          transform: translateX(18px);
        }

        .chat-window {
          width: 100%;
          height: 400px;
          overflow-y: auto;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 15px;
        }

        .dark-mode .chat-window {
          background: #3b3b3b;
        }

        .user-message {
          text-align: right;
          background: #4FD1A5;
          color: white;
          padding: 10px 15px;
          border-radius: 12px;
          margin: 5px 0;
          max-width: 80%;
          margin-right: 10px;
          margin-left: auto;
        }

        .bot-message {
          text-align: left;
          background: linear-gradient(to right, #A8D8D3, #4FD1A5);
          color: #1C6C52;
          padding: 10px 15px;
          border-radius: 12px;
          margin: 5px 0;
          max-width: 80%;
          margin-left: 10px;
        }

        .dark-mode .bot-message {
          background: #2b2b2b;
          color: #4FD1A5;
        }

        .input-container {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .chat-input {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 16px;
        }

        .dark-mode .chat-input {
          background: #3b3b3b;
          color: white;
          border: 1px solid #4FD1A5;
        }

        .send-button {
          margin-left: 10px;
          background: #4FD1A5;
          border: none;
          color: white;
          font-size: 18px;
          padding: 10px 15px;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s;
        }

        .send-button:hover {
          background: #217A5D;
        }
      `}</style>
    </div></div>
  );
};

export default Chatbot;