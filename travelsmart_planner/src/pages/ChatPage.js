import React, { useState, useRef, useEffect } from "react";

/*
  Uses Cohere API for AI chat if you provide a .env key:

    REACT_APP_COHERE_KEY

  You must add this env var to your .env file at the root:
    REACT_APP_COHERE_KEY=your_cohere_api_key

  Demo responses only if not present!
*/

// PUBLIC_INTERFACE
function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! Ask me anything about your trip or travel planning." }
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  const chatBottomRef = useRef(null);

  // Load Cohere API key
  const cohereKey = process.env.REACT_APP_COHERE_KEY || '';

  // Scroll to bottom whenever messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  function handleInputChange(e) {
    setInput(e.target.value);
  }

  // Handle sending question (simulate async AI reply)
  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input.trim() };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setPending(true);

    // If key missing, use demo/fallback reply, else here would be real fetch
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: !cohereKey
            ? "You are seeing demo AI tips. Add your Cohere API key in .env for live suggestions! (API placeholder)"
            : "Here's a travel tip: Research local transportation options in advance to save time and reduce stress on your trip! (API placeholder, would hit Cohere API)"
        }
      ]);
      setPending(false);
    }, 1200);
  }

  return (
    <section className="chat-section">
      <div className="section-title">AI Suggestions</div>
      <div className="section-description">
        Chat with our AI for trip tips, local highlights, or general travel guidance.
      </div>

      {!cohereKey && (
        <div style={{
          background: "#ffe4e1",
          color: "#ae6c46",
          border: "1.5px solid #f8b14f",
          borderRadius: 8,
          padding: "10px 14px",
          marginBottom: 10,
          fontWeight: 500,
          textAlign: "center"
        }}>
          <b>Cohere API Key not detected.</b> You're in demo mode!<br/>
          Add <code>REACT_APP_COHERE_KEY</code> to your <code>.env</code> for live AI chat.<br/>
          <span style={{color:"#cb7cb6",fontSize:"0.93em"}}>.env example:<br/>
            REACT_APP_COHERE_KEY=your_api_key
          </span>
        </div>
      )}

      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${msg.sender === "user" ? "user" : "ai"}`}
            >
              {msg.text}
            </div>
          ))}
          {pending && (
            <div className="chat-bubble ai">
              <span>...</span>
            </div>
          )}
          <div ref={chatBottomRef}></div>
        </div>
        <form
          className="chat-input-row"
          onSubmit={handleSend}
          autoComplete="off"
        >
          <input
            className="chat-input"
            autoFocus
            value={input}
            onChange={handleInputChange}
            placeholder="Ask the AI for recommendations..."
          />
          <button
            className="btn"
            style={{ borderRadius: "7px" }}
            disabled={pending || !input.trim()}
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
      <div style={{ fontSize: "0.89em", color: "#aaa", marginTop: 12 }}>
        <b>API Note:</b> Set <code>REACT_APP_COHERE_KEY</code> in your .env for live, AI-powered travel suggestions via Cohere.
      </div>
    </section>
  );
}

export default ChatPage;
