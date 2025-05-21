// app/chatbot/page.js or pages/chatbot.js
"use client";
import { useState, useEffect } from "react";

export default function ChatbotPage() {
  const [isOpen, setIsOpen] = useState(true); // Always start open in iframe mode
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! How can I help you today?", isBot: true },
  ]);
  const [input, setInput] = useState("");

  // Send message to parent window when chat state changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.parent !== window) {
      window.parent.postMessage(isOpen ? "chatOpen" : "chatClosed", "*");
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { id: Date.now(), text: input, isBot: false };
    setMessages([...messages, userMessage]);

    // Generate response based on simple if/else logic
    setTimeout(() => {
      let botResponse = "I'm not sure how to respond to that.";

      const userInput = input.toLowerCase();

      if (userInput.includes("hello") || userInput.includes("hi")) {
        botResponse = "Hello there! How are you today?";
      } else if (userInput.includes("how are you")) {
        botResponse =
          "I'm just a simple chatbot, but I'm working well! How about you?";
      } else if (userInput.includes("help") || userInput.includes("support")) {
        botResponse =
          "I can help with basic information. What do you need assistance with?";
      } else if (userInput.includes("bye") || userInput.includes("goodbye")) {
        botResponse = "Goodbye! Have a great day!";
      } else if (userInput.includes("contact")) {
        botResponse =
          "You can contact us at support@example.com or call (123) 456-7890.";
      } else if (userInput.includes("price") || userInput.includes("cost")) {
        botResponse =
          "Our basic package starts at $99/month. Premium plans start at $199/month.";
      }

      const botMessage = { id: Date.now() + 1, text: botResponse, isBot: true };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 500);

    setInput("");
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
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
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
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
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
      <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-medium">Chat Support</h3>
        {!iframeMode && (
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200"
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
                  : "bg-blue-500 text-white"
              }`}
            >
              {msg.text}
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
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
          >
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
          </button>
        </div>
      </div>
    </div>
  );
}
