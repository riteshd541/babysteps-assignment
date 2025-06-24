const API_BASE = "http://localhost:5000/api";

export const getTips = async (milestoneId) => {
  const res = await fetch(`${API_BASE}/tips/${milestoneId}`);
  return res.json();
};

export const addTip = async (milestoneId, tipData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/tips/${milestoneId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(tipData),
  });
  return res.json();
};
