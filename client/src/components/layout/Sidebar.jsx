
function Sidebar() {
  return (
    <aside className="w-72 bg-zinc-950 border-r border-gray-800 p-5">

      <button className="w-full bg-white text-black rounded-lg py-3 font-semibold hover:bg-gray-200 transition">
        + New Chat
      </button>

      <div className="mt-8">

        <p className="text-gray-400 mb-4">
          Recent Chats
        </p>

      </div>

    </aside>
  );
}

export default Sidebar;