import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-black px-3 py-3 sm:px-8 sm:py-5">

      <div></div>

      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4 w-full sm:w-auto">

        <select className="rounded-xl bg-zinc-900 px-3 py-2 text-sm sm:text-base text-white border border-zinc-700 outline-none">
          <option>Gemini 2.5 Flash</option>
        </select>

        <button className="text-zinc-400 hover:text-white">
          <Settings size={22} />
        </button>

        {user ? (
          <div className="flex flex-wrap items-center gap-2">

            <span className="text-white font-medium">
              {user.name}
            </span>

            <Button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600"
            >
              Logout
            </Button>

          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">

            <Link to="/login">
              <Button>
                Login
              </Button>
            </Link>

            <Link to="/register">
              <Button
                className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                "
              >
                Register
              </Button>
            </Link>

          </div>
        )}

      </div>

    </header>
  );
}

export default Header;
