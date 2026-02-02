const User = require("../models/user.model");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password");

    res.status(200).json({
      totalUsers: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
