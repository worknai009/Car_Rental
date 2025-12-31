import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:1000/admin/register", { name, email, password });
      alert("Admin registered successfully!");
      navigate("/admin/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Admin Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
        >
          Register
        </button>

        {/* Link to Admin Login */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/admin/login" className="text-red-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AdminRegister;
