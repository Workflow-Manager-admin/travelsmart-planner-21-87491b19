import React, { useState, useRef, useEffect } from "react";

// PUBLIC_INTERFACE
function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! Ask me anything about your trip or travel planning." }
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  const chatBottomRef = useRef(null);

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

    // Simulate async AI reply (replace with API post to GPT/Cohere)
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "ai",
          text: "Here's a travel tip: Research local transportation options in advance to save time and reduce stress on your trip! (API placeholder)"
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
        <b>API Note:</b> Connect to OpenAI or Cohere for real responses (API key in requirements).
      </div>
    </section>
  );
}

export default ChatPage;
