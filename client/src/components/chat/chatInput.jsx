import { useState } from "react";
import { Paperclip, Mic, SendHorizontal } from "lucide-react";

import Input from "../ui/Input";
import IconButton from "../ui/IconButton";


function ChatInput({ onSend, isTyping }) {
    const [message, setMessage] = useState("");
    const handleSend = () => {
        if (!message.trim()) return;

        onSend(message);

        setMessage("");
    };
  return (
    <div className="border-t border-zinc-800 bg-black p-5">

      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2">

          <IconButton>
            <Paperclip size={20} />
          </IconButton>

          <Input
            
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleSend();
                }
            }}
            disabled={isTyping}
            placeholder="Message Nova AI..."
            className="
                flex-1
                border-none
                bg-transparent
                focus:border-none
                shadow-none
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