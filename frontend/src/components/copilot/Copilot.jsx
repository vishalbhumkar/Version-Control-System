import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { ScaleLoader } from "react-spinners";
import { v4 as uuidv4 } from "uuid";
import "highlight.js/styles/github-dark.css";
import "./Copilot.css";

const Copilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [allThreads, setAllThreads] = useState([]);
  const [currThreadId, setCurrThreadId] = useState("");
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const messagesEndRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest(".copilot-header-btn") || e.target.closest("button")) {
      return;
    }
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Initialize first chat thread ID if not set
  useEffect(() => {
    if (!currThreadId) {
      setCurrThreadId(uuidv4());
    }
  }, [currThreadId]);

  // Fetch all threads
  const fetchAllThreads = async () => {
    try {
      const response = await axios.get("https://vcs-69so.onrender.com/copilot/thread");
      setAllThreads(response.data);
    } catch (err) {
      console.error("Error fetching threads:", err);
    }
  };

  // Fetch all threads on mount or when visibility changes
  useEffect(() => {
    if (isOpen) {
      fetchAllThreads();
    }
  }, [isOpen, currThreadId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // Create a brand new chat
  const createNewChat = () => {
    setMessages([]);
    setPrompt("");
    setCurrThreadId(uuidv4());
    setShowHistory(false);
  };

  // Switch to a different thread
  const selectThread = async (threadId) => {
    setCurrThreadId(threadId);
    setLoading(true);
    setShowHistory(false);
    try {
      const response = await axios.get(`https://vcs-69so.onrender.com/copilot/thread/${threadId}`);
      setMessages(response.data);
    } catch (err) {
      console.error("Error fetching thread messages:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete thread
  const deleteThread = async (e, threadId) => {
    e.stopPropagation();
    try {
      await axios.delete(`https://vcs-69so.onrender.com/copilot/thread/${threadId}`);
      setAllThreads((prev) => prev.filter((t) => t.threadId !== threadId));
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error("Error deleting thread:", err);
    }
  };

  // Submit chat query
  const handleSend = async () => {
    if (!prompt.trim() || loading) return;

    const userMessage = prompt;
    setPrompt("");

    // Optimistically update message list
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post("https://vcs-69so.onrender.com/copilot/chat", {
        threadId: currThreadId,
        message: userMessage,
      });

      // Append AI reply
      setMessages((prev) => [...prev, { role: "assistant", content: response.data.reply }]);
    } catch (err) {
      console.error("Error sending message to Copilot:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "**Error:** Failed to get response from Copilot. Please check your backend connection." },
      ]);
    } finally {
      setLoading(false);
      // Refresh thread list so the title or timestamp updates
      fetchAllThreads();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="copilot-container">
      {/* Floating Toggle Button */}
      <button className="copilot-btn" onClick={() => setIsOpen(!isOpen)} title="Toggle Copilot">
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
            <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
          </svg>
        )}
      </button>

      {/* Copilot Main Window */}
      {isOpen && (
        <div
          className="copilot-window"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          {/* Header */}
          <div className="copilot-header" onMouseDown={handleMouseDown}>
            <div className="copilot-header-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <circle cx="12" cy="5" r="2"></circle>
                <path d="M12 7v4"></path>
                <line x1="8" y1="16" x2="8" y2="16"></line>
                <line x1="16" y1="16" x2="16" y2="16"></line>
              </svg>
              <span>Cortex AI Copilot</span>
            </div>
            <div className="copilot-header-actions">
              <button 
                className="copilot-header-btn" 
                onClick={() => setShowHistory(!showHistory)} 
                title={showHistory ? "Back to chat" : "Chat history"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
              <button 
                className="copilot-header-btn" 
                onClick={createNewChat} 
                title="New Chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="copilot-content">
            {showHistory ? (
              // History Threads View
              <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div className="copilot-history-title">Previous Chats</div>
                {allThreads.length === 0 ? (
                  <div className="copilot-empty-history">
                    <p>No chat history yet.</p>
                  </div>
                ) : (
                  <ul className="copilot-thread-list">
                    {allThreads.map((thread) => (
                      <li
                        key={thread.threadId}
                        className={`copilot-thread-item ${thread.threadId === currThreadId ? "active" : ""}`}
                        onClick={() => selectThread(thread.threadId)}
                      >
                        <span className="copilot-thread-text">{thread.title}</span>
                        <button
                          className="copilot-thread-delete"
                          onClick={(e) => deleteThread(e, thread.threadId)}
                          title="Delete thread"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              // Message View
              <>
                {messages.length === 0 ? (
                  <div className="copilot-welcome">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                      <circle cx="12" cy="5" r="2"></circle>
                      <path d="M12 7v4"></path>
                    </svg>
                    <h4>Welcome to Cortex AI Copilot</h4>
                    <p>
                      I can help you understand your codebase, write Git commits, debug issues, or answer general programming questions.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`copilot-msg ${msg.role}`}>
                      {msg.role === "user" ? (
                        msg.content
                      ) : (
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  ))
                )}

                {loading && (
                  <div className="copilot-loading">
                    <ScaleLoader color="#58a6ff" height={15} width={3} radius={2} margin={2} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Footer Input Area */}
          {!showHistory && (
            <div className="copilot-footer">
              <div className="copilot-input-container">
                <input
                  type="text"
                  className="copilot-input"
                  placeholder="Ask anything..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
                <button
                  className="copilot-send-btn"
                  onClick={handleSend}
                  disabled={!prompt.trim() || loading}
                  title="Send message"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
              <p className="copilot-info">Cortex Copilot can make mistakes. Verify important info.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Copilot;
