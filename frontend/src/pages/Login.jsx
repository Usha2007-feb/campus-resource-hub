import { useState } from "react";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password }
      );

      // save token
      localStorage.setItem("token", res.data.token);

      setMessage("Login successful");

      // redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      setMessage("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent2">
      <div className="w-[360px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-primary text-center mb-1">
          Campus Resource Hub
        </h1>

        <p className="text-sm text-gray-600 text-center mb-4">
          Login to continue
        </p>

        {message && (
          <p className="text-center text-sm mb-3 text-primary">
            {message}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          New here?{" "}
          <a
            href="/register"
            className="text-primary font-semibold hover:underline"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
