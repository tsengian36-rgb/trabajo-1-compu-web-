import CrudPage from "../CrudPage.jsx";

export const clp = (n) => `$${Number(n).toLocaleString("es-CL")}`;

export default function MenuItems() {
  return (
    <CrudPage
      title="Platos y precios"
      path="/menu_items"
      resourceKey="menu_item"
      fields={[
        { name: "restaurant_id", label: "Local", type: "select", optionsPath: "/restaurants", required: true },
        { name: "name", label: "Plato", required: true },
        { name: "price", label: "Precio (CLP)", type: "number", required: true },
        { name: "category", label: "Categoría" },
        { name: "description", label: "Descripción", type: "textarea" },
        { name: "available", label: "Disponible", type: "checkbox" },
      ]}
      columns={[
        { key: "name", label: "Plato" },
        { key: "restaurant_name", label: "Local" },
        { key: "price", label: "Precio", render: (i) => clp(i.price) },
        { key: "available", label: "Disponible", render: (i) => (i.available ? "Sí" : "No") },
      ]}
    />
  );
}
