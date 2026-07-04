import { Settings, ChevronDown } from "lucide-react";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

function Navbar() {
  return (
    <header className="h-18 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-8">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Nova AI
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        <button
          className="
            flex
            items-center
            gap-2
            bg-zinc-900
            px-4
            py-2
            rounded-xl
            text-white
            hover:bg-zinc-800
            transition
          "
        >
          Gemini 2.5 Flash

          <ChevronDown size={18} />
        </button>

        <IconButton>
          <Settings size={20} />
        </IconButton>

        <Button
          className="
            bg-white
            text-black
            hover:bg-gray-200
          "
        >
          Login
        </Button>

      </div>

    </header>
  );
}

export default Navbar;