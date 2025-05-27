// app/chatbot/page.js or pages/chatbot.js
"use client";
import { useState, useEffect } from "react";

export default function TutorChatbotPage() {
  const [isOpen, setIsOpen] = useState(true); // Always start open in iframe mode
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there! I’m here to guide you through ParlayProz—your go-to for data-driven sports betting insights. What would you like to know?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Send message to parent window when chat state changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.parent !== window) {
      window.parent.postMessage(isOpen ? "chatOpen" : "chatClosed", "*");
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input;
    // Add user message
    const userMessage = { id: Date.now(), text: userInput, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add typing indicator
    const typingMessage = {
      id: Date.now() + 1,
      text: "Bot is thinking...",
      isBot: true,
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userInput,
          convHistory: messages
            .filter((m) => !("isTyping" in m))
            .map((m) => m.text),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Remove typing indicator and add AI response
      setMessages((prev) => {
        const withoutTyping = prev.filter((msg) => !("isTyping" in msg));
        return [
          ...withoutTyping,
          {
            id: Date.now() + 2,
            text: data.response,
            isBot: true,
          },
        ];
      });
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Remove typing indicator and add error message
      setMessages((prev) => {
        const withoutTyping = prev.filter((msg) => !("isTyping" in msg));
        return [
          ...withoutTyping,
          {
            id: Date.now() + 2,
            text: "I'm sorry, I'm having trouble connecting right now. Let me try to help with some basic tutoring instead! What subject are you studying?",
            isBot: true,
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // In iframe mode, we always show the chat window
  // But keep the toggle button for the main page
  const iframeMode =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/chatbot");

  if (!isOpen && !iframeMode) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </button>
    );
  }

  return (
    <div
      className={`${
        iframeMode ? "w-full h-full" : "fixed bottom-4 right-4"
      } w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <h3 className="font-medium">ParlayProz Assistant</h3>
        </div>
        {!iframeMode && (
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex ${
              msg.isBot ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.isBot
                  ? "bg-white border border-gray-200 text-gray-800"
                  : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t p-3 bg-white">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about any subject..."
            disabled={isLoading}
            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-r-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
