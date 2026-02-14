import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import MeetingRoom from "./pages/MeetingRoom";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meeting/:roomId"
          element={
            <ProtectedRoute>
              <MeetingRoom />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
