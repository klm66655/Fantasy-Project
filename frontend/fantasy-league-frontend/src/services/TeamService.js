const API_URL = "http://localhost:8080/teams";

// ✅ Dohvati sve timove
export async function getAllTeams() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch teams");
  return await res.json();
}

// ✅ Dohvati jedan tim po ID-u
export async function getTeamById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch team details");
  return await res.json();
}

// ✅ Dodaj novi tim
export async function addTeam(team) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(team),
  });
  if (!res.ok) throw new Error("Failed to add team");
  return await res.json();
}
