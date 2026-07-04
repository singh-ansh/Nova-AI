import {
  Plus,
  Search,
  MessageSquare,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col">

      {/* Top */}
      <div className="p-5">

        <button
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-white
            text-black
            py-3
            font-semibold
            hover:bg-gray-200
            transition
          "
        >
          <Plus size={20} />
          New Chat
        </button>

        <div
          className="
            mt-5
            flex
            items-center
            gap-3
            rounded-xl
            bg-zinc-900
            px-4
            py-3
            text-gray-400
          "
        >
          <Search size={18} />

          <input
            type="text"
            placeholder="Search chats..."
            className="
              bg-transparent
              outline-none
              flex-1
              text-sm
            "
          />
        </div>

      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-5">

        <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">
          Today
        </p>

        {[
          "React Project",
          "Nova AI Design",
          "Tailwind Notes",
          "Gemini API",
        ].map((chat, index) => (
          <button
            key={index}
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-3
              rounded-lg
              text-gray-300
              hover:bg-zinc-900
              transition
              mb-2
            "
          >
            <MessageSquare size={18} />

            <span className="truncate">
              {chat}
            </span>

          </button>
        ))}

      </div>

    </aside>
  );
}

export default Sidebar;