import { useEffect, useState } from "react";
import { api, describeError } from "../api.js";
import { useAuth } from "../auth.jsx";
import { clp } from "./MenuItems.jsx";

const STATUS = { critico: "Saldo crítico", medio: "Saldo medio", holgado: "Saldo holgado" };

export default function Recommendations() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(user?.current_balance || 0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Espera 300 ms después de mover el slider antes de consultar la API
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        setError("");
        setData(await api(`/recommendations?budget=${balance}`));
      } catch (e) {
        setError(describeError(e));
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [balance]);

  return (
    <section>
      <h1>Qué puedo comer hoy</h1>
      <div className="card">
        <label>
          Saldo disponible: <strong>{clp(balance)}</strong>
          <input type="range" min="0" max="150000" step="1000" value={balance}
                 onChange={(e) => setBalance(Number(e.target.value))} />
        </label>
        {data && (
          <p>
            Quedan {data.remaining_days} días hábiles este mes. Puedes gastar hasta{" "}
            <strong>{clp(data.daily_budget)}</strong> por día ({STATUS[data.status]}).
          </p>
        )}
      </div>
      {error && <p className="msg error" role="alert">{error}</p>}
      {loading && <p className="state">Calculando…</p>}
      {!loading && data && data.recommendations.length === 0 && (
        <p className="state">Con este presupuesto diario no hay platos disponibles. Registra más platos o sube el saldo.</p>
      )}
      <ul className="reco">
        {data?.recommendations.map((i) => (
          <li key={i.id} className="card">
            <strong>{i.name}</strong> — {i.restaurant_name}
            <span className="price">{clp(i.price)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
