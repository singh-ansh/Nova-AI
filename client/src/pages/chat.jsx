import axios from "axios";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "user",
      text: "Hello Nova AI",
    },
    {
      id: 2,
      sender: "ai",
      text: "Hello Babu Saheb 👋",
    },
  ]);

  // AI typing state
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        {
          message: text,
        }
      );

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: response.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Sorry! Something went wrong.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">

        {/* Header */}
        <Header />

        {/* Messages */}
        <ChatMessages
          messages={messages}
          isTyping={isTyping}
        />

        {/* Input */}
        <ChatInput
          onSend={handleSendMessage}
          isTyping={isTyping}
        />

      </div>

    </div>
  );
}

export default Chat;