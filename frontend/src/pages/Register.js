import { useState } from "react";
import { register } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setMessage("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(form);
    setLoading(false);

    if (result.message) {
      setMessage("✅ Registered successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setMessage(result.error || "❌ Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-blue-600 text-center">
          📝 Create Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-2">
          Join the BabySteps community!
        </p>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          disabled={loading}
          className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
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
            "Register"
          )}
        </button>

        {message && (
          <p
            className={`text-center text-sm ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
