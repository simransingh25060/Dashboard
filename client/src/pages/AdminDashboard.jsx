import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        return;
      }

      const res = await fetch(
        "http://localhost:3001/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-2">
        Admin Dashboard
      </h1>

      <p className="text-gray-400 mb-6">
        Total users: {users.length}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gray-800 rounded-xl p-5 shadow-lg flex items-center gap-4"
          >
            {/* Profile Image */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
              <img
                src={user.profileImage || "/default.png"}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">
                {user.name}
              </h3>

              <p className="text-gray-400 text-sm truncate">
                {user.email}
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-semibold
                  ${
                    user.role === "admin"
                      ? "bg-red-600 text-white"
                      : "bg-blue-600 text-white"
                  }
                `}
              >
                {user.role.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
