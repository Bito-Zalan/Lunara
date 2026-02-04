import { useAuth } from "../context/AuthContext";

export default function Admin() {
  const { profile, signOut } = useAuth();

  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", background: "#fff", padding: "1rem", borderRadius: 12 }}>
      <h2>Admin</h2>
      <p>Belépve mint: {profile?.email}</p>
      <button onClick={signOut}>Kijelentkezés</button>
    </main>
  );
}
