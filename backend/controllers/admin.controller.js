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

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password, // assume password hashing middleware exists
      role: "user", 
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.adminChangePassword = async (req, res) => {
  try {
     
    const {userId, newPassword} = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({message: "UserId and newPassword required!"})
    }

    if (newPassword.length < 6) {
      return res.status(400).json({message: "Password must contain atleast 6 characters"})
    }

    if (req.user.id === userId) {
      return res.status(400).json({ message: "Use normal change password for yourself" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({message: "Password updated successfully!"})

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
};

