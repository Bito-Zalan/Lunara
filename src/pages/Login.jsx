import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { signIn } = useAuth();
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");

        try {
            console.log("CLICK LOGIN", { email, passwordLen: password.length });
            const { data, error } = await signIn(email.trim(), password);
            console.log("LOGIN RESULT", { data, error });

            if (error) return setErr(error.message);
            nav("/admin");
        } catch (e) {
            console.log("LOGIN THROW", e);
            setErr(e?.message ?? "Ismeretlen hiba");
        }
    };

    return (
        <main style={{ maxWidth: 420, margin: "2rem auto", background: "#fff", padding: "1rem", borderRadius: 12 }}>
            <h2>Bejelentkezés</h2>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: ".8rem", marginTop: "1rem" }}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Jelszó" />
                {err && <p style={{ color: "crimson" }}>{err}</p>}
                <button type="submit">Belépés</button>
            </form>
        </main>
    );
}
