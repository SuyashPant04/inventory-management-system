import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Table from "../ui/Table";

function OrderDetailsModal({ isOpen, order, onClose }) {
  if (!isOpen || !order) return null;

  const columns = [
    { key: "product", label: "Product Name" },
    { key: "quantity", label: "Quantity" },
    { key: "unitPrice", label: "Unit Price" },
    { key: "total", label: "Total" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      title={`Order #${order.id}`}
      onClose={onClose}
    >
      <div className="space-y-6">
        {/* Order Info */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold text-gray-900">#{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold text-lg text-blue-600">
                ₹{order.total_amount}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Customer Information
          </h4>
          <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-2">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium text-gray-900">
                {order.customer?.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-gray-900">{order.customer?.email}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Order Items
          </h4>
          <div className="border border-gray-200 rounded overflow-hidden">
            <Table
              columns={columns}
              data={order.items || []}
              renderRow={(item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {item.product?.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-center">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    ₹{item.unit_price}
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    ₹{item.quantity * item.unit_price}
                  </td>
                </tr>
              )}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{order.total_amount}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg text-gray-900 pt-2 border-t">
                <span>Total:</span>
                <span className="text-blue-600">₹{order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default OrderDetailsModal;
