const API_BASE = "https://babysteps-assignment-dlzz.onrender.com/api";

export const getMilestones = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/milestones`, {
    headers: { Authorization: token },
  });
  return res.json();
};

export const createMilestone = async (data) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/milestones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteMilestone = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/milestones/${id}`, {
    method: "DELETE",
    headers: { Authorization: token },
  });
  return res.json();
};
