import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        email,
        password,
      });

      login(data.token);

      navigate("/chat");

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Login Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl"
      >

        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Login
        </h1>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500 bg-red-500/20 p-3 text-red-300">
            {error}
          </div>
        )}

        {/* Email */}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            mb-5
            w-full
            rounded-xl
            bg-zinc-800
            px-4
            py-3
            text-white
            outline-none
            border
            border-transparent
            focus:border-blue-500
          "
        />

        {/* Password */}

        <div className="relative mb-6">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              rounded-xl
              bg-zinc-800
              px-4
              py-3
              pr-12
              text-white
              outline-none
              border
              border-transparent
              focus:border-blue-500
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>

        </div>

        {/* Login Button */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-xl
            bg-blue-600
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        {/* Register Link */}

        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
          >
            Create Account
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;