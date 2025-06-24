import { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form);
    setLoading(false);

    if (result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.user.id);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("userName", result.user.name);
      localStorage.setItem("userEmail", result.user.email);
      navigate("/dashboard");
    } else {
      setError(result.message || result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-indigo-600 text-center">
          👋 Welcome Back!
        </h2>
        <p className="text-sm text-center text-gray-500 mb-2">
          Please login to continue
        </p>

        <input
          name="email"
          type="email"
          placeholder="Email address"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          disabled={loading}
          className="w-full flex items-center justify-center bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l4-4-4-4v4a12 12 0 00-12 12h4z"
              ></path>
            </svg>
          ) : (
            "Login"
          )}
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <p className="text-sm text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
