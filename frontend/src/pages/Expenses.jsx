import CrudPage from "../CrudPage.jsx";
import { clp } from "./MenuItems.jsx";

export default function Expenses() {
  return (
    <CrudPage
      title="Mis gastos"
      path="/expenses"
      resourceKey="expense"
      fields={[
        { name: "description", label: "Descripción", required: true },
        { name: "amount", label: "Monto (CLP)", type: "number", required: true },
        { name: "spent_on", label: "Fecha", type: "date", required: true },
        { name: "menu_item_id", label: "Plato (opcional)", type: "select", optionsPath: "/menu_items" },
      ]}
      columns={[
        { key: "spent_on", label: "Fecha" },
        { key: "description", label: "Descripción" },
        { key: "amount", label: "Monto", render: (e) => clp(e.amount) },
        { key: "menu_item_name", label: "Plato" },
      ]}
    />
  );
}
