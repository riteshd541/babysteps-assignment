import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = localStorage.getItem("user");
  const name = JSON.parse(user).name;
  const email = JSON.parse(user).email;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-600">
        👶 BabySteps Dashboard
      </h1>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-md"
        >
          <span className="text-lg">👤</span>
          <span className="text-sm font-medium hidden sm:inline">Account</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-md border z-50 p-4 text-sm space-y-2">
            <p className="font-semibold text-gray-800">{name}</p>
            <p className="text-gray-500 text-xs">{email}</p>
            <hr />
            <button
              onClick={handleLogout}
              className="w-full text-left text-red-500 hover:underline"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
