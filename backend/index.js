require("dotenv").config();

const express = require("express");
const cors = require("cors"); 
const connectDB = require("./config/db");
const upload = require("./middleware/multer.middleware.js");
const { updateProfile } = require("./controllers/auth.controller.js");

connectDB();

const app = express();

app.use(cors());             
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.status(200).json({
    message: "HELLO",
  });
});

app.use("/api/auth", require("./routes/auth.routes.js"));
app.use("/api/admin", require("./routes/admin.routes.js"));


app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`
  });
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
