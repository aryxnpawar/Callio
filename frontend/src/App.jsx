import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  return (

      <BrowserRouter>

      <Link to="/login">Login</Link>
      <br />
      <Link to="/register">Register</Link>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>

  );
}

export default App;
