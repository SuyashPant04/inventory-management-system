import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CustomersPage from "./pages/CustomersPage";
import OrdersPage from "./pages/OrdersPage";
import CreateOrderPage from "./pages/CreateOrderPage";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>

          <Route
            path="/"
            element={<DashboardPage />}
          />

          <Route
            path="/products"
            element={<ProductsPage />}
          />

          <Route
            path="/customers"
            element={<CustomersPage />}
          />

          <Route
            path="/orders"
            element={<OrdersPage />}
          />

          <Route
            path="/create-order"
            element={<CreateOrderPage />}
          />

        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;