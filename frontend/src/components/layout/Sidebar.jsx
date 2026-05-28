import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass =
    "block px-4 py-2 rounded hover:bg-gray-700";

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">
        Inventory Management System
      </h1>

      <nav className="space-y-2">
        <NavLink to="/" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/products" className={linkClass}>
          Products
        </NavLink>

        <NavLink to="/customers" className={linkClass}>
          Customers
        </NavLink>

        <NavLink to="/orders" className={linkClass}>
          Orders
        </NavLink>

        <NavLink to="/create-order" className={linkClass}>
          Create Order
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;