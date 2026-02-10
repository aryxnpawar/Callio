import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) {
        alert("Login failed");
        return;
      }
  
      const data = await res.json();
      console.log(data);
    }
    catch(err){
      console.error("Error during login:", err);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

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

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
