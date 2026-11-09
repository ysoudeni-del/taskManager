import { useNavigate } from "react-router-dom";
import Task from "./Task";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center px-6 pt-6">
        <p className="text-gray-300">Welcome, {user?.username || "User"}</p>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <h2 className="text-center font-bold text-4xl pt-11 text-gray-100">
        Task Manager
      </h2>

      <Task />
    </div>
  );
};

export default Home;
