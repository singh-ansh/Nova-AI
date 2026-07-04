import { Settings } from "lucide-react";
import Button from "../ui/Button";

function Header() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-black px-8 py-5">

      <div></div>

      <div className="flex items-center gap-4">

        <select className="rounded-xl bg-zinc-900 px-4 py-2 text-white border border-zinc-700 outline-none">
          <option>Gemini 2.5 Flash</option>
        </select>

        <button className="text-zinc-400 hover:text-white">
          <Settings size={22} />
        </button>

        <Button>Login</Button>

      </div>

    </header>
  );
}

export default Header;