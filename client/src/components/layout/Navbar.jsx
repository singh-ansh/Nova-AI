import { Settings, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import { useAuth } from "../../context/AuthContext";

function Navbar() {

  const { user, logout } = useAuth();

  return (
    <header className="h-18 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Nova AI
        </h1>
      </div>

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

        {user ? (
          <div className="flex items-center gap-3">

            <span className="text-white font-medium">
              {user.name}
            </span>

            <Button
              onClick={logout}
              className="
                bg-red-500
                hover:bg-red-600
              "
            >
              Logout
            </Button>

          </div>
        ) : (
          <Link to="/login">

            <Button
              className="
                bg-white
                text-black
                hover:bg-gray-200
              "
            >
              Login
            </Button>

          </Link>
        )}

      </div>

    </header>
  );
}

export default Navbar;