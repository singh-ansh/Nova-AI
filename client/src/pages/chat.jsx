import axios from "axios";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";

function Chat() {
  const [messages, setMessages] = useState([]);

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

      const fullReply = response.data.reply;

      const aiMessageId = Date.now() + 1;

      const aiMessage = {
        id: aiMessageId,
        sender: "ai",
        text: "",
      };

      setMessages((prev) => [...prev, aiMessage]);
      let index = 0;

      const interval = setInterval(() => {
        index+= 3;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                ...msg,
                text: fullReply.slice(0, index),
              }
              : msg
          )
        );

        if (index >= fullReply.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 10);
    } catch (error) {
      console.error(error);

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Sorry! Something went wrong.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      // Streaming complete hone par hi isTyping false hoga
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