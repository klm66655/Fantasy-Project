import "./RegisterPage.css";
import { useState } from "react";
import { register } from "../services/api";
import { useNavigate } from "react-router-dom";
import  Header  from "../components/HeaderLogin";
import Footer from "../components/FooterLogin";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const user = await register(username, email, password);
      console.log("Registered user:", user);
      setSuccess("Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1500); // redirect na login
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div>
      <Header />
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <p className="login-text">
      Already have an account?{" "}
      <button onClick={() => navigate("/login")} className="link-btn">
        Go to Login
      </button>
      </p>
      </div>
      <Footer/>
    </div>
  );
}
