import { useState } from "react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name,email, password }),
      });
  
      if (!res.ok) {
        alert("Register failed");
        return;
      }
  
      const data = await res.json();
      console.log(data);
    }
    catch(err){
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
