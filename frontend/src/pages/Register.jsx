import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/auth/register",
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );
      login(response.data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error during Register:", err);
      alert("An error occurred during Register. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input
        placeholder="Enter name"
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />

      <br />

      <input
        placeholder="Enter email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />

      <br />

      <input
        placeholder="Enter password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />

      <br />

      <button type="submit">Register</button>
      
    </form>
  );
}

export default Register;
