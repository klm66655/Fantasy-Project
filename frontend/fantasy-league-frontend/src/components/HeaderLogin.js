import "./HeaderLogin.css";
export default function Header() {
  return (
    <header style={{ padding: "10px", backgroundColor: "#007bff", color: "white" }}>
      <h1>Fantasy</h1>
      <nav>
        <a href="/" style={{ marginRight: "10px", color: "white" }}>Home</a>
        <a href="/login" style={{ color: "white" }}>Login</a>
      </nav>
    </header>
  );
}
