import "./HeaderLogin.css";

export default function Header() {
  const token = localStorage.getItem("token"); // proveri da li je user logovan
  const isLoggedIn = !!token; // true ako postoji token

  return (
    <header style={{ padding: "10px", backgroundColor: "#007bff", color: "white" }}>
      <h1>Fantasy</h1>
      <nav>
        <a href="/" style={{ marginRight: "10px", color: "white" }}>Home</a>
        {!isLoggedIn && <a href="/login" style={{ marginRight: "10px", color: "white" }}>Login</a>}
        {isLoggedIn && <a href="/profile" style={{ marginRight: "10px", color: "white" }}>Profile</a>}
        <a href="/highlights" style={{ marginRight: "10px", color: "white" }}>Highlights</a>
        <a href="/players" style={{ color: "white" }}>Top Stats</a>
      </nav>
    </header>
  );
}
