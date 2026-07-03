function Navbar() {
  return (
    <header className="h-16 border-b border-gray-800 bg-zinc-950 flex items-center justify-between px-6">

      <h1 className="text-2xl font-bold text-white">
        Nova AI
      </h1>

      <button className="bg-zinc-800 px-4 py-2 rounded-lg text-white hover:bg-zinc-700 transition">
        Login
      </button>

    </header>
  );
}

export default Navbar;
