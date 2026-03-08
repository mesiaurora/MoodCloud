import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Register() {
const [credentials, setCredentials] = useState({ username: "", password: "" });

const { register } = useAuth();
const navigate = useNavigate();

const handleRegister = async () => {
  await register(credentials.username, credentials.password);
  navigate("/");
}

  return (
<div className="min-h-screen flex items-center justify-center bg-frost">
  <div className="bg-lavender rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-4">
    <h1 className="text-2xl font-bold text-plum text-center">Register to MoodCloud</h1>
    <p className="text-plum text-center text-sm">Create a MoodCloud account </p>
    <div>
        <p className="text-plum text-center text-sm">Already have an account? </p>
        <button onClick={() => navigate("/login")} className="text-teal hover:underline ">Login here</button>
    </div>  


    <div className="flex flex-col gap-1">
      <label className="text-plum text-sm font-medium" htmlFor="username">Username</label>
      <input
        className="bg-mist border border-steel rounded-lg p-2 text-plum outline-none focus:ring-2 focus:ring-teal"
        type="text" id="username" name="username"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-plum text-sm font-medium" htmlFor="password">Password</label>
      <input
        className="bg-mist border border-steel rounded-lg p-2 text-plum outline-none focus:ring-2 focus:ring-teal"
        type="password" id="password" name="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
    </div>

    <button
      className="bg-plum text-lavender rounded-lg p-2 font-semibold hover:opacity-90 transition-opacity"
      onClick={handleRegister}
    >
      Register
    </button>
  </div>
  </div>)
}