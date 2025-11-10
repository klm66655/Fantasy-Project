import "./LoginPage.css";
import { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
import Header from "../components/HeaderLogin";
import Footer from "../components/FooterLogin";

export default function LoginPage() {
  const [username, setUsername] = useState(""); // <-- promenjeno sa email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const fetchCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch("http://localhost:8080/api/users/me", {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) return null;

  const user = await res.json();
  // Sačuvaj ID i role u localStorage
  localStorage.setItem("userId", user.id);
  localStorage.setItem("role", user.role); // <-- ovo je ključno za frontend
  return user;
};


   const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = await login(username, password);
    localStorage.setItem("token", token);

    const user = await fetchCurrentUser();
    if (!user) {
      setError("Failed to fetch user info");
      return;
    }

    alert(`Logged in successfully as ${user.role}!`);
    navigate("/"); // ideš na dashboard ili home
  } catch (err) {
    setError("Invalid credentials");
  }
};


  

  return (
    <div>
      <Header />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p className="login-text">
          You don't have an account?{" "}
          <button onClick={() => navigate("/register")} className="link-btn">
            Go to Register
          </button>
        </p>
        {error && <p className="error">{error}</p>}
      </div>
      <Footer />
    </div>
  );
}
