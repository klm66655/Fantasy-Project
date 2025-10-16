import "./LoginPage.css";
import { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
import  Header  from "../components/HeaderLogin";
import Footer from "../components/FooterLogin";


export default function LoginPage() {
  const [username, setUsername] = useState(""); // <-- promenjeno sa email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(username, password); // <-- promenjeno
      localStorage.setItem("token", token);
      localStorage.setItem("userId", response.id);
      alert("Logged in successfully!");
      navigate("/");
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
          placeholder="Username" // <-- promenjeno
          value={username}
          onChange={(e) => setUsername(e.target.value)} // <-- promenjeno
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
