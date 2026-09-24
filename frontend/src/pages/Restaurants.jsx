import CrudPage from "../CrudPage.jsx";

export default function Restaurants() {
  return (
    <CrudPage
      title="Locales asociados"
      path="/restaurants"
      resourceKey="restaurant"
      fields={[
        { name: "name", label: "Nombre", required: true },
        { name: "category", label: "Categoría" },
        { name: "address", label: "Dirección" },
        { name: "description", label: "Descripción", type: "textarea" },
      ]}
      columns={[
        { key: "name", label: "Nombre" },
        { key: "category", label: "Categoría" },
        { key: "address", label: "Dirección" },
      ]}
    />
  );
}
