import {
  Plus,
  Search,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react";

function Sidebar({
  chats = [],
  chatId,
  setChatId,
  setMessages,
  loadChat,
  search,
  setSearch,
  deleteChat,
  renameChat,
}) {

  const handleNewChat = () => {
    setChatId(null);
    setMessages([]);
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <aside className="w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col">

      {/* Top */}
      <div className="p-5">

        <button
          onClick={handleNewChat}
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          Chats
        </p>

        {filteredChats.map((chat) => (
          <div
            key={chat._id}
            className={`
              group
              flex
              items-center
              justify-between
              rounded-lg
              mb-2

              ${chatId === chat._id
                ? "bg-zinc-800"
                : "hover:bg-zinc-900"
              }
            `}
          >

            <button
              onClick={() => loadChat(chat._id)}
              className="
                flex
                items-center
                gap-3
                px-3
                py-3
                flex-1
                text-left
              "
            >
              <MessageSquare size={18} />

              <div className="ml-auto flex items-center gap-2">

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    const title = prompt(
                      "Enter new chat title",
                      chat.title
                    );

                    if (title && title.trim()) {
                      renameChat(chat._id, title);
                    }
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <Pencil size={16} />
                </button>

              </div>

              <span className="truncate">
                {chat.title}
              </span>

            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();

                if (
                  window.confirm(
                    "Delete this chat?"
                  )
                ) {
                  onDelete(chat._id);
                }
              }}
              className="
                opacity-0
                group-hover:opacity-100
                transition
                px-3
                text-gray-400
                hover:text-red-500
              "
            >
              <Trash2 size={17} />
            </button>

          </div>
        ))}

      </div>

    </aside>
  );
}

export default Sidebar;