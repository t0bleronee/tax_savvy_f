import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { marked } from "marked";

import Navbar from "../../Components/Navbar";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
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
    <div className="page-container">
      <div className="content-box">
        <div className="header">
          <h2 className="title">CHAT WITH AI</h2>
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

        {/* Suggestion Buttons */}
        <div className="suggestions">
          <button onClick={() => setInput("What is the standard deduction for salaried employees?")} className="suggestion-button">
            Standard Deduction?
          </button>
          <button onClick={() => setInput("Can I switch between old and new tax regimes every year?")} className="suggestion-button">
            Tax Regime Switching?
          </button>
          <button onClick={() => setInput("How does this year's Union Budget affect my taxes?")} className="suggestion-button">
            Budget & Taxes?
          </button>
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
        }

        .content-box {
          max-width: 700px;
          width: 100%;
          background: white;
          border-radius: 20px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }

        .header {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }

        .title {
          font-size: 28px;
          font-weight: bold;
          color: #217A5D;
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

        /* Suggestion Buttons */
        .suggestions {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .suggestion-button {
          background: #A8D8D3;
          color: #217A5D;
          border: none;
          padding: 10px 15px;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          transition: 0.3s;
        }

        .suggestion-button:hover {
          background: #4FD1A5;
          color: white;
        }
      `}</style>
    </div></div>
  );
};

export default Chatbot;