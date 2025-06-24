import { useEffect, useState } from "react";
import {
  getMilestones,
  createMilestone,
  deleteMilestone,
} from "../services/milestoneApi";
import { getTips, addTip } from "../services/tipApi";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header"; // adjust path as needed

export default function Dashboard() {
  const navigate = useNavigate();
  const [milestones, setMilestones] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", notes: "" });
  const [tipInputs, setTipInputs] = useState({});
  const [tipsData, setTipsData] = useState({});
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "mine", "community"
  const currentUserId = localStorage.getItem("userId");

  const fetchMilestones = async () => {
    const data = await getMilestones();
    setMilestones(data || []);
    for (const milestone of data) {
      const tips = await getTips(milestone._id);
      setTipsData((prev) => ({ ...prev, [milestone._id]: tips }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    fetchMilestones();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createMilestone(form);
    if (result._id) {
      setMessage("Milestone added!");
      setForm({ title: "", date: "", notes: "" });
      fetchMilestones();
    } else {
      setMessage("Failed to add milestone");
    }
  };

  const handleDelete = async (id) => {
    await deleteMilestone(id);
    fetchMilestones();
  };

  const handleTipSubmit = async (milestoneId) => {
    const tipText = tipInputs[milestoneId]?.text || "";
    const userName = tipInputs[milestoneId]?.name || "Anonymous";
    if (!tipText) return;

    await addTip(milestoneId, { tipText, userName });
    setTipInputs((prev) => ({
      ...prev,
      [milestoneId]: { name: "", text: "" },
    }));
    const updatedTips = await getTips(milestoneId);
    setTipsData((prev) => ({ ...prev, [milestoneId]: updatedTips }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          🎯 Add Your Milestones
        </h2>

        {/* Add Milestone Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-white p-6 rounded-xl shadow-md space-y-4"
        >
          <h3 className="text-xl font-semibold text-gray-800">
            ➕ Add Milestone
          </h3>
          <input
            type="text"
            name="title"
            placeholder="Milestone title (e.g., First ultrasound)"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="date"
            name="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <textarea
            name="notes"
            placeholder="Optional notes..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          ></textarea>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            Add Milestone
          </button>
          {message && <p className="text-green-600 mt-2">{message}</p>}
        </form>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${
              filter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Milestones
          </button>
          <button
            onClick={() => setFilter("mine")}
            className={`px-4 py-2 rounded ${
              filter === "mine"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            My Milestones
          </button>
          <button
            onClick={() => setFilter("community")}
            className={`px-4 py-2 rounded ${
              filter === "community"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Community Milestones
          </button>
        </div>

        {/* Milestones List */}
        <div className="space-y-6">
          {milestones.length === 0 && (
            <p className="text-center text-gray-500 italic">
              No milestones yet. Start your journey above!
            </p>
          )}

          {milestones
            .filter((m) => {
              if (filter === "mine") return m.user === currentUserId;
              if (filter === "community") return m.user !== currentUserId;
              return true; // all
            })
            .map((m) => (
              <div
                key={m._id}
                className="bg-white rounded-xl shadow-md p-6 relative border-l-4 border-indigo-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-700">
                      {m.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(m.date).toDateString()}
                    </p>
                  </div>
                  {m.user === currentUserId && (
                    <button
                      onClick={() => handleDelete(m._id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {m.notes && (
                  <p className="mt-2 text-gray-700 text-sm italic">{m.notes}</p>
                )}

                {/* Community Tips */}
                <div className="mt-5 bg-gray-50 p-4 rounded-md">
                  <h4 className="text-md font-bold text-gray-700 mb-2">
                    💡 Community Tips
                  </h4>

                  {tipsData[m._id]?.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No tips yet. Be the first to share!
                    </p>
                  )}

                  <ul className="space-y-2 mb-3">
                    {tipsData[m._id]?.map((tip) => (
                      <li key={tip._id} className="text-sm text-gray-700">
                        <span className="font-semibold">{tip.userName}:</span>{" "}
                        {tip.tipText}
                      </li>
                    ))}
                  </ul>

                  {/* Tip Input Form */}
                  <div className="flex flex-col gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      className="border p-2 text-sm rounded focus:outline-none focus:ring-1 focus:ring-indigo-300"
                      value={tipInputs[m._id]?.name || ""}
                      onChange={(e) =>
                        setTipInputs((prev) => ({
                          ...prev,
                          [m._id]: { ...prev[m._id], name: e.target.value },
                        }))
                      }
                    />
                    <input
                      type="text"
                      placeholder="Add your tip..."
                      className="border p-2 text-sm rounded focus:outline-none focus:ring-1 focus:ring-indigo-300"
                      value={tipInputs[m._id]?.text || ""}
                      onChange={(e) =>
                        setTipInputs((prev) => ({
                          ...prev,
                          [m._id]: { ...prev[m._id], text: e.target.value },
                        }))
                      }
                    />
                    <button
                      onClick={() => handleTipSubmit(m._id)}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1 rounded self-start transition"
                    >
                      Submit Tip
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
