import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function Chat() {
  return (
    <div className="h-screen bg-black">

      <Navbar />

      <div className="flex h-[calc(100vh-64px)]">

        <Sidebar />

        <main className="flex-1 flex items-center justify-center">

          <h1 className="text-white text-5xl font-bold">
            Welcome to Nova AI
          </h1>

        </main>

      </div>

    </div>
  );
}

export default Chat;