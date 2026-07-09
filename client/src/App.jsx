import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Chat from "./pages/chat";
import Login from "./pages/login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        {/* Public */}
        <Route path="/chat" element={<Chat />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
