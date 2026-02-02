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

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // prevent admin from deleting themselves
    if (req.user.id === userId) {
      return res
        .status(400)
        .json({ message: "Admin cannot delete their own account" });
    }

    // check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
