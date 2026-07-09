import axios from "axios";
import { useEffect, useRef, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";

import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [search, setSearch] = useState("");

  const intervalRef = useRef(null);

  const { user } = useAuth();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  useEffect(() => {
    fetchChats();
  }, [user]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(
        "https://nova-ai-5opr.onrender.com/api/chat",
        {
          headers: getAuthHeaders(),
        }
      );

      setChats(res.data.chats || []);

    } catch (err) {
      console.log(err);
    }
  };

  const renameChat = async (id, title) => {
    try {

      await axios.patch(
        `https://nova-ai-5opr.onrender.com/api/chat/${id}`,
        { title },
        {
          headers: getAuthHeaders(),
        }
      );

      fetchChats();

    } catch (err) {
      console.log(err);
    }
  };

  const loadChat = async (id) => {
    try {

      const res = await axios.get(
        `https://nova-ai-5opr.onrender.com/api/chat/${id}`,
        {
          headers: getAuthHeaders(),
        }
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

  const handleSendMessage = async (text, file) => {

    if (!text.trim() && !file) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text,
      },
    ]);

    setIsTyping(true);

    try {

      const formData = new FormData();

      formData.append("message", text);

      if (chatId) {
        formData.append("chatId", chatId);
      }

      if (file) {
        formData.append("file", file);
      }

      const response = await axios.post(
        "https://nova-ai-5opr.onrender.com/api/chat",
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.chatId) {
        setChatId(response.data.chatId);
      }

      if (user) {
        fetchChats();
      }

      const fullReply = response.data.reply;

      const aiMessageId = Date.now() + 1;

      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          sender: "ai",
          text: "",
          prompt: text,
        },
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

  // ===============================
  // Stop Generating
  // ===============================
  const stopGenerating = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsTyping(false);
  };

  // ===============================
  // Regenerate Response
  // ===============================
  const handleRegenerate = async (prompt) => {
    if (!prompt) return;

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
        "https://nova-ai-5opr.onrender.com/api/chat",
        {
          message: prompt,
          chatId,
        },
        {
          headers: getAuthHeaders(),
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
      setIsTyping(false);
    }
  };

  // ===============================
  // Delete Chat
  // ===============================
  const deleteChat = async (id) => {
    try {

      await axios.delete(
        `https://nova-ai-5opr.onrender.com/api/chat/${id}`,
        {
          headers: getAuthHeaders(),
        }
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

  // ===============================
  // Logout => Clear Guest State
  // ===============================
  useEffect(() => {
    if (!user) {
      setChats([]);
      setChatId(null);
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-black text-white">

      {user && (
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
      )}

      <div className="flex flex-1 flex-col">

        <Header />

        {!user && (
          <div className="border-b border-yellow-500/20 bg-yellow-500/10 px-6 py-3 text-center text-sm text-yellow-300">
            Guest Mode • Your chats won't be saved.
            <Link
              to="/login"
              className="ml-2 font-semibold underline"
            >
              Login
            </Link>{" "}
            to save chat history.
          </div>
        )}

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
