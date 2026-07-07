import axios from "axios";
import { useEffect, useRef, useState } from "react";


import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";

function Chat() {
  const [messages, setMessages] = useState([]);

  const [chatId, setChatId] = useState(null);

  const [chats, setChats] = useState([]);

  const [isTyping, setIsTyping] = useState(false);

  const [search, setSearch] = useState("");

  const intervalRef = useRef(null);

  // ===============================
  // Load all chats
  // ===============================
  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chat");
      setChats(res.data.chats);
    } catch (err) {
      console.log(err);
    }
  };

  const renameChat = async (id, title) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/chat/${id}`,
        {
          title,
        }
      );

      // Sidebar refresh
      await fetchChats();

    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // Load Previous Chat
  // ===============================
  const loadChat = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/chat/${id}`
      );

      setChatId(id);

      setMessages(
        res.data.messages.map((msg) => ({
          id: msg._id,
          sender: msg.role === "user" ? "user" : "ai",
          text: msg.content,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // Send Message
  // ===============================
  const handleSendMessage = async (text, file) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {
      const formData = new FormData();

      formData.append("message", text);
      formData.append("chatId", chatId || "");

      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        "http://localhost:5000/api/chat",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Save chat id
      if (response.data.chatId) {
        setChatId(response.data.chatId);
      }

      // Refresh Sidebar
      await fetchChats();

      const fullReply = response.data.reply;

      const aiMessageId = Date.now() + 1;

      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          sender: "ai",
          text: "",
          prompt: text,
        }
      ]);

      let index = 0;

      intervalRef.current = setInterval(() => {
        index += 3;

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
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsTyping(false);
        }
      }, 10);

    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "ai",
          text: "Something went wrong.",
        },
      ]);

      setIsTyping(false);
    }
  };

  const stopGenerating = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsTyping(false);
  };

  const handleRegenerate = async (prompt) => {
    if (!prompt) return;

    // Last AI message remove
    setMessages((prev) => {
      const copy = [...prev];

      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].sender === "ai") {
          copy.splice(i, 1);
          break;
        }
      }

      return copy;
    });

    setIsTyping(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        {
          message: prompt,
          chatId,
        }
      );

      const fullReply = response.data.reply;

      const aiMessageId = Date.now();

      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          sender: "ai",
          text: "",
          prompt,
        },
      ]);

      let index = 0;

      const interval = setInterval(() => {
        index += 3;

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

    } catch (err) {
      console.log(err);
      setIsTyping(false);
    }
  };

  const deleteChat = async (id) => {
    try {

      await axios.delete(
        `http://localhost:5000/api/chat/${id}`
      );

      if (chatId === id) {
        setChatId(null);
        setMessages([]);
      }

      fetchChats();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">

      <Sidebar
        chats={chats}
        chatId={chatId}
        setChatId={setChatId}
        setMessages={setMessages}
        loadChat={loadChat}
        search={search}
        setSearch={setSearch}
        deleteChat={deleteChat}
        renameChat={renameChat}
      />

      <div className="flex flex-1 flex-col">

        <Header />

        <ChatMessages
          messages={messages}
          isTyping={isTyping}
          onRegenerate={handleRegenerate}
        />

        <ChatInput
          onSend={handleSendMessage}
          isTyping={isTyping}
          stopGenerating={stopGenerating}
        />

      </div>

    </div>
  );
}

export default Chat;