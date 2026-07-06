import { useEffect, useRef, useState } from "react";
import { Paperclip, Mic, SendHorizontal } from "lucide-react";

// import Input from "../ui/Input";
import IconButton from "../ui/IconButton";


function ChatInput({ onSend, isTyping }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  }, [message]);
  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message);

    setMessage("");


    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }, 0);
  };
  return (
    <div className="border-t border-zinc-800 bg-black p-5">

      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2">

          <IconButton>
            <Paperclip size={20} />
          </IconButton>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isTyping}
            placeholder="Message Nova AI..."
            rows={1}
            className="
            flex-1
            resize-none
            bg-transparent
            outline-none
            text-white
            placeholder:text-gray-400
            py-3
            max-h-48
            overflow-y-auto
            
            "
          />


          <IconButton>
            <Mic size={20} />
          </IconButton>

          <button
            onClick={handleSend}
            disabled={isTyping}
            className="
            h-10
            w-10
            rounded-full
            bg-white
            text-black
            flex
            items-center
            justify-center
            hover:bg-gray-200
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
            "
          >
            <SendHorizontal size={18} />
          </button>

        </div>
        {/* <p className="text-white mt-2">{message}</p> */}

      </div>

    </div>
  );
}

export default ChatInput;