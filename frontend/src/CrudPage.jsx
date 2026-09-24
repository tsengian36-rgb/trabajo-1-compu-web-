import { useCallback, useEffect, useState } from "react";
import { api, describeError } from "./api.js";

const emptyForm = (fields) =>
  Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? true : ""]));

/**
 * Pantalla CRUD reutilizable.
 * - path: ruta de la API (ej. "/restaurants")
 * - resourceKey: clave con que Rails espera los parámetros (ej. "restaurant")
 * - fields: campos del formulario
 * - columns: columnas de la tabla
 */
export default function CrudPage({ title, path, resourceKey, fields, columns }) {
  const [items, setItems] = useState([]);
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm(fields));
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await api(path));
      const opts = {};
      for (const f of fields.filter((f) => f.optionsPath)) opts[f.name] = await api(f.optionsPath);
      setOptions(opts);
    } catch (e) {
      setError(describeError(e));
    } finally {
      setLoading(false);
    }
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  const reset = () => { setEditingId(null); setForm(emptyForm(fields)); };

  const startEdit = (item) => {
    setEditingId(item.id);
    setNotice("");
    setError("");
    setForm(Object.fromEntries(fields.map((f) => [f.name, item[f.name] ?? (f.type === "checkbox" ? false : "")])));
  };

  const buildBody = () =>
    Object.fromEntries(
      fields.map((f) => {
        const v = form[f.name];
        if (f.type === "number" || f.type === "select") return [f.name, v === "" ? null : Number(v)];
        return [f.name, v];
      })
    );

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    const missing = fields.filter((f) => f.required && (form[f.name] === "" || form[f.name] == null));
    if (missing.length) {
      setError(`Completa los campos obligatorios: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }
    setSaving(true);
    try {
      await api(editingId ? `${path}/${editingId}` : path, {
        method: editingId ? "PATCH" : "POST",
        body: { [resourceKey]: buildBody() },
      });
      setNotice(editingId ? "Cambios guardados" : "Registro creado");
      reset();
      await load();
    } catch (e2) {
      setError(describeError(e2));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    setError("");
    setNotice("");
    try {
      await api(`${path}/${item.id}`, { method: "DELETE" });
      setNotice("Registro eliminado");
      if (editingId === item.id) reset();
      await load();
    } catch (e) {
      setError(describeError(e));
    }
  };

  return (
    <section>
      <h1>{title}</h1>
      {error && <p className="msg error" role="alert">{error}</p>}
      {notice && <p className="msg ok" role="status">{notice}</p>}

      <form className="card" onSubmit={submit} noValidate>
        <h2>{editingId ? "Editar registro" : "Nuevo registro"}</h2>
        <div className="grid">
          {fields.map((f) => (
            <label key={f.name} className={f.type === "checkbox" ? "check" : ""}>
              {f.label}{f.required && " *"}
              {f.type === "select" ? (
                <select value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                  <option value="">{f.required ? "Selecciona…" : "Ninguno"}</option>
                  {(options[f.name] || []).map((o) => (
                    <option key={o.id} value={o.id}>{o[f.optionLabel || "name"]}</option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea rows={2} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              ) : f.type === "checkbox" ? (
                <input type="checkbox" checked={!!form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} />
              ) : (
                <input type={f.type || "text"} min={f.type === "number" ? 1 : undefined} value={form[f.name]}
                       onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              )}
            </label>
          ))}
        </div>
        <div className="actions">
          <button type="submit" disabled={saving}>{saving ? "Guardando…" : editingId ? "Guardar cambios" : "Crear"}</button>
          {editingId && <button type="button" className="secondary" onClick={reset}>Cancelar</button>}
        </div>
      </form>

      {loading ? (
        <p className="state">Cargando…</p>
      ) : items.length === 0 ? (
        <p className="state">Aún no hay registros. Crea el primero con el formulario.</p>
      ) : (
        <div className="scroll">
          <table>
            <thead>
              <tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th></th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {columns.map((c) => <td key={c.key}>{c.render ? c.render(item) : item[c.key]}</td>)}
                  <td className="row-actions">
                    <button className="secondary" onClick={() => startEdit(item)}>Editar</button>
                    <button className="danger" onClick={() => remove(item)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
