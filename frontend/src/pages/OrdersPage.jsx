import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import OrderDetailsModal from "../components/modals/OrderDetailsModal";
import orderService from "../services/orderService";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const getOrderStatusBadge = (order) => {
    // You can enhance this logic based on order status from backend
    return <Badge variant="success">Completed</Badge>;
  };

  if (loading) {
    return <Loader message="Loading orders..." />;
  }

  const columns = [
    { key: "id", label: "Order ID" },
    { key: "customer", label: "Customer" },
    { key: "items", label: "Items" },
    { key: "total", label: "Total Amount" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Orders
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage your customer orders
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <Card>
        {orders.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No Orders Found"
            message="No orders have been placed yet. Orders will appear here once customers place their first order."
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={paginatedOrders}
              renderRow={(order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    #{order.id}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-gray-900 font-medium">
                        {order.customer?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.customer?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {order.items?.length || 0} item
                      {order.items?.length !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">
                    ₹{order.total_amount}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="secondary"
                      className="text-sm px-3 py-1"
                      onClick={() => handleViewDetails(order)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              )}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, orders.length)} of{" "}
                  {orders.length} orders
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages)
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={showDetailsModal}
        order={selectedOrder}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default OrdersPage;