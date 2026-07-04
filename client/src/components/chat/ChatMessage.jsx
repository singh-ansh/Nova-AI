function ChatMessage({ sender, message }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[70%]
          px-5
          py-3
          rounded-2xl
          whitespace-pre-wrap
          ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 text-white"
          }
        `}
      >
        {message}
      </div>
    </div>
  );
}

export default ChatMessage;