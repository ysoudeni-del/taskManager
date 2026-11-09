import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://taskmanager-1-wp93.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.hash = "#/";
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-6 p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/10 border border-white/20 rounded-2xl p-8 space-y-5 text-white"
      >
        <h1 className="text-3xl font-bold text-center">Welcome Back</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/20 border border-white/20 outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/20 border border-white/20 outline-none"
          required
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-blue-600 font-semibold"
        >
          Login
        </button>
      </form>
      <p className="text-center text-gray-300">
        Don't have an account?{" "}
        <a href="#/register" className="text-pink-400 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
};

export default Login;
