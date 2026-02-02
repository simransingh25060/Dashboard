const User = require("../models/user.model");
const bcrypt = require("bcryptjs");  //Used to hash passwords
const jwt = require("jsonwebtoken");  //create JWT tokens
const { uploadOnCloudinary } = require("../utils/cloudinary");

exports.signup = async(req, res) => {
   try {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({message: "All fields required"});
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create ({
        name,
        email,
        password: hashedPassword,
        role: "admin"
    });  //Create user in DB
    res.status(201).json({message: "Signup successful"});

   } catch (err) {
    res.status(500).json({message: "Server error"});
   }
};


exports.login = async(req, res) => {
   try {
    const { email, password} = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({message: "Invalid credentials"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );  //Generate JWT token

    res.json({token});

   } catch (err) {
    res.status(500).json({message: "Server error"});
   }
};

exports.updateProfile = async (req, res) => {
  try {
      // console.log(req)
    // check if file exists
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // upload to cloudinary (file comes from multer)
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    // console.log(cloudinaryResponse)
    if (!cloudinaryResponse) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }
  

    // update user profile image
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: cloudinaryResponse.secure_url },
      { new: true }
    ).select("-password");
    // console.log(user)
    res.status(200).json({
      message: "Profile image updated successfully",
      user
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
  const user = req.user;
  res.status(200).json({ user,message: "Successful!"})
  } catch (err) {
    console.log(err)
    res.status(202).json({message: "Profile user not found!"})
  }
};