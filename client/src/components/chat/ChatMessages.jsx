import ChatMessage from "./ChatMessage";

function ChatMessages({ messages, isTyping }) {
  return (
    <div className="flex-1 overflow-y-auto p-10">
      <div className="max-w-5xl mx-auto space-y-6">

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            sender={msg.sender}
            message={msg.text}
          />
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 text-white px-5 py-3 rounded-2xl">
              Nova AI is typing...
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ChatMessages;