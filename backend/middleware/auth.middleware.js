const jwt = require('jsonwebtoken')
const User = require('../models/user.model.js')

const verifyJWT = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        // console.log(token)
        if ( token && token.startsWith("Bearer ")) {
            token = token.replace("Bearer ", "");
        }
        // console.log('Extracted token:', token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized request: No token provided" });
        }
        // Verify token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.log('JWT verification error:', err.message);
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        // console.log('Decoded token:', decodedToken);
        const user = await User.findById(decodedToken?.id).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json({ message: "Invalid Access Token: User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        // console.log('verifyJWT error:', error.message);
        return res.status(401).json({ message: error?.message || "Invalid access token" });
    }
}

module.exports = { verifyJWT };