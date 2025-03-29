import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { marked } from "marked";

import Navbar from '../../Components/Navbar';
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
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
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

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
    <div style={darkMode ? styles.darkContainer : styles.lightContainer}>
      <button onClick={() => setDarkMode(!darkMode)} style={styles.toggleButton}>
        {darkMode ? "🌞" : "🌙"}
      </button>

      <h2 style={darkMode ? styles.darkHeading : styles.lightHeading}>Ask our AI anything</h2>

      <div ref={chatWindowRef} style={darkMode ? styles.darkChatWindow : styles.lightChatWindow}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.sender === "user" ? styles.userMessage : (darkMode ? styles.darkBotMessage : styles.lightBotMessage)} dangerouslySetInnerHTML={{ __html: msg.text }} />
        ))}
      </div>

      <div style={styles.suggestions}>
        <button onClick={() => setInput("What is the standard deduction for salaried employees?")} style={styles.suggestionButton}>
          Standard Deduction?
        </button>
        <button onClick={() => setInput("Can I switch between old and new tax regimes every year?")} style={styles.suggestionButton}>
          Tax Regime Switching?
        </button>
        <button onClick={() => setInput("How does this year's Union Budget affect my taxes?")} style={styles.suggestionButton}>
          Budget & Taxes?
        </button>
      </div>

      <div style={darkMode ? styles.darkInputContainer : styles.lightInputContainer}>
        <input
          style={darkMode ? styles.darkInput : styles.lightInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Need help? I'm here to assist"
        />
        <button style={styles.sendButton} onClick={sendMessage}>
          ➤
        </button>
      </div>
    </div></div>
  );
};

const styles = {
  lightContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(to bottom, #ffffff, #e6f7e6)",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  },
  darkContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(to bottom, #1a1a1a, #333333)",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    color: "white",
    position: "relative",
  },
  toggleButton: {
    position: "absolute",
    top: "15px",
    right: "20px",
    backgroundColor: "#2e7d32",
    border: "none",
    color: "white",
    fontSize: "18px",
    padding: "10px",
    borderRadius: "50%",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
    transition: "opacity 0.3s ease-in-out",
  },
  lightHeading: { fontSize: "24px", fontWeight: "bold", marginBottom: "10px" },
  darkHeading: { fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "10px" },
  lightChatWindow: {
    width: "600px",
    height: "400px",
    overflowY: "auto",
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "15px",
  },
  darkChatWindow: {
    width: "600px",
    height: "400px",
    overflowY: "auto",
    padding: "15px",
    backgroundColor: "#222",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(255,255,255,0.1)",
    marginBottom: "15px",
    color: "white",
  },
  userMessage: {
    textAlign: "right",
    backgroundColor: "#2e7d32",
    color: "white",
    padding: "10px 15px",
    borderRadius: "12px",
    margin: "5px 0",
    alignSelf: "flex-end",
    maxWidth: "80%",
    marginRight: "10px",
    marginLeft: "auto",
  },
  lightBotMessage: {
    textAlign: "left",
    backgroundColor: "#c8e6c9",
    color: "black",
    padding: "10px 15px",
    borderRadius: "12px",
    margin: "5px 0",
    alignSelf: "flex-start",
    maxWidth: "80%",
    marginLeft: "10px",
  },
  darkBotMessage: {
    textAlign: "left",
    backgroundColor: "#444",
    color: "white",
    padding: "10px 15px",
    borderRadius: "12px",
    margin: "5px 0",
    alignSelf: "flex-start",
    maxWidth: "80%",
    marginLeft: "10px",
  },
  sendButton: {
    marginLeft: "10px",
    cursor: "pointer",
  },
  lightInputContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "600px",
    marginTop: "10px",
  },
  darkInputContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "600px",
    marginTop: "10px",
  },
  lightInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "500px",
  },
  darkInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #555",
    backgroundColor: "#333",
    color: "white",
    fontSize: "16px",
    width: "500px", 
  },
  suggestions: {
    marginTop: "10px",
  },
  suggestionButton: {
    padding: "10px 20px",
    margin: "5px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Chatbot;
