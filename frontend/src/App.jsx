import React, { useState, useRef, useEffect } from "react";

function App() {
  // --- State Management ---
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! 🌤️ Ask me for the weather in any city.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Auto-scroll Logic ---
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // --- Send Message Logic ---
  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    // 1. Add User Message
    const userMsgText = inputValue;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: userMsgText },
    ]);
    setInputValue("");
    setLoading(true);

    try {
      // 2. Call Backend
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsgText }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      // 3. Add Bot Response
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: data.response },
      ]);
    } catch (err) {
      // Handle Error
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "❌ Error: Could not reach the backend.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Weather Bot 🌤️</h2>
        </div>

        {/* Chat Area */}
        <div style={styles.chatWindow}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.row,
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={msg.sender === "user" ? styles.userBubble : styles.botBubble}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={styles.row}>
              <div style={styles.botBubble}>Thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={styles.inputArea}>
          <input
            style={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a city name..."
            disabled={loading}
          />
          <button
            style={styles.button}
            onClick={sendMessage}
            disabled={loading || !inputValue.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

// --- CSS-in-JS Styles ---

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f2f5",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    width: "400px",
    height: "600px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "16px",
    background: "#007bff",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: "18px",
  },
  chatWindow: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    background: "#eef1f5",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  row: {
    display: "flex",
    width: "100%",
  },
  userBubble: {
    background: "#007bff",
    color: "#ffffff", // White text on Blue
    padding: "10px 14px",
    borderRadius: "12px 12px 0 12px",
    maxWidth: "80%",
    wordWrap: "break-word",
  },
  botBubble: {
    background: "#ffffff",
    color: "#333333", // Dark Grey text on White
    padding: "10px 14px",
    borderRadius: "12px 12px 12px 0",
    maxWidth: "80%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    wordWrap: "break-word",
  },
  inputArea: {
    padding: "12px",
    borderTop: "1px solid #ddd",
    display: "flex",
    gap: "10px",
    background: "#fff",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    outline: "none",
    color: "#000", // Force black text input
    backgroundColor: "#fff",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "20px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};