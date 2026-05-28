import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import dashboardService from "../services/dashboardService";

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err) {
      setError("Failed to load dashboard statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Overview of your inventory and orders
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Products */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {stats?.total_products || 0}
            </div>
            <p className="text-blue-700 font-medium">Total Products</p>
          </div>
        </Card>

        {/* Total Customers */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {stats?.total_customers || 0}
            </div>
            <p className="text-green-700 font-medium">Total Customers</p>
          </div>
        </Card>

        {/* Total Orders */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {stats?.total_orders || 0}
            </div>
            <p className="text-purple-700 font-medium">Total Orders</p>
          </div>
        </Card>

        {/* Low Stock Products */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {stats?.low_stock_products || 0}
            </div>
            <p className="text-orange-700 font-medium">Low Stock Items</p>
          </div>
        </Card>

        {/* Total Revenue */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">
              ₹{(stats?.total_revenue || 0).toLocaleString()}
            </div>
            <p className="text-red-700 font-medium">Total Revenue</p>
          </div>
        </Card>
      </div>

      {/* Low Stock Products Section */}
      {stats?.low_stock_products_list && stats.low_stock_products_list.length > 0 && (
        <Card title="⚠️ Low Stock Products">
          <div className="space-y-3">
            {stats.low_stock_products_list.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    SKU: {product.sku}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="danger" className="inline-block">
                    Stock: {product.stock}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    ₹{product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty State for Low Stock */}
      {!stats?.low_stock_products_list || stats.low_stock_products_list.length === 0 ? (
        <Card>
          <EmptyState
            icon="✅"
            title="All Products in Stock"
            message="Great! All your products have healthy inventory levels."
          />
        </Card>
      ) : null}
    </div>
  );
}

export default DashboardPage;