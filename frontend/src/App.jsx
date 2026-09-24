import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Restaurants from "./pages/Restaurants.jsx";
import MenuItems from "./pages/MenuItems.jsx";
import Expenses from "./pages/Expenses.jsx";
import Recommendations from "./pages/Recommendations.jsx";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="state">Cargando sesión…</p>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user, logout } = useAuth();
  return (
    <>
      <header className="topbar">
        <strong className="brand">BalanceFood</strong>
        {user && (
          <nav>
            <NavLink to="/recomendaciones">Qué puedo comer hoy</NavLink>
            <NavLink to="/locales">Locales</NavLink>
            <NavLink to="/menus">Platos</NavLink>
            <NavLink to="/gastos">Mis gastos</NavLink>
            <button className="link" onClick={logout}>Cerrar sesión ({user.name})</button>
          </nav>
        )}
      </header>
      <main>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/registro" element={user ? <Navigate to="/" replace /> : <Register />} />
          <Route path="/recomendaciones" element={<Protected><Recommendations /></Protected>} />
          <Route path="/locales" element={<Protected><Restaurants /></Protected>} />
          <Route path="/menus" element={<Protected><MenuItems /></Protected>} />
          <Route path="/gastos" element={<Protected><Expenses /></Protected>} />
          <Route path="*" element={<Navigate to="/recomendaciones" replace />} />
        </Routes>
      </main>
    </>
  );
}
