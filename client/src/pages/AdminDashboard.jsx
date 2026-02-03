import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
});


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

   const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Add user (admin)
  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3001/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add user");
      }

      // add new user to UI
      setUsers((prev) => [data.user, ...prev]);

      // reset form
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
  if (!window.confirm("Are you sure you want to delete this user?")) {
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:3001/api/admin/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete user");
    }

    // remove deleted user from UI
    setUsers((prev) => prev.filter((u) => u._id !== userId));
  } catch (err) {
    alert(err.message);
  }
};


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

      {/* 🔹 ADD USER FORM */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8 max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">
          Add New User
        </h2>

        <form onSubmit={handleAddUser} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
          >
            Add User
          </button>
        </form>
      </div>

      {/* 🔹 USERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gray-800 rounded-xl p-5 shadow-lg flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
              <img
                src={user.profileImage || "/default.png"}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">
                {user.name}
              </h3>

              <p className="text-gray-400 text-sm truncate">
                {user.email}
              </p>

              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`px-2 py-1 text-xs rounded-lg font-semibold
                    ${
                      user.role === "admin"
                        ? "bg-red-600 text-white"
                        : "bg-blue-600 text-white"
                    }
                  `}
                >
                  {user.role.toUpperCase()}
                </span>

                {user.role !== "admin" && (
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="px-2 py-1 text-xs bg-red-700 hover:bg-red-800 text-white rounded-lg"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;