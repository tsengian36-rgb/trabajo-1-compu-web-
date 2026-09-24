import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { describeError } from "../api.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", current_balance: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Ingresa tu nombre");
    if (!EMAIL_RE.test(form.email)) return setError("Ingresa un correo válido");
    if (form.password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres");
    setBusy(true);
    try {
      await signup({ ...form, current_balance: Number(form.current_balance || 0) });
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card narrow" onSubmit={submit} noValidate>
      <h1>Crear cuenta</h1>
      {error && <p className="msg error" role="alert">{error}</p>}
      <label>Nombre<input value={form.name} onChange={set("name")} /></label>
      <label>Correo<input type="email" value={form.email} onChange={set("email")} /></label>
      <label>Contraseña (mínimo 8 caracteres)<input type="password" value={form.password} onChange={set("password")} /></label>
      <label>Saldo inicial JUNAEB (CLP)<input type="number" min="0" value={form.current_balance} onChange={set("current_balance")} /></label>
      <button type="submit" disabled={busy}>{busy ? "Creando…" : "Crear cuenta"}</button>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </form>
  );
}
