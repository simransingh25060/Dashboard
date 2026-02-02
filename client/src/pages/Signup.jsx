import {useState} from "react";
import axios from "axios";
import {useNavigate, Link} from "react-router-dom";

function Signup() {
    const navigate = useNavigate();
    const  [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    //Runs when input fields are typed

    const handleSubmit = async (e) => {
        e.preventDefault(); //Prevents page reload after form submitted

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/signup`, 
                formData);  //API call
            alert("Signup successful");
            navigate("/login");
        } catch (err) {
          alert(err.response?.data?.message || "Signup failed");
        }
    };

    
 return (
     <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account 
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;