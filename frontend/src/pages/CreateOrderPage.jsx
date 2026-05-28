import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import Badge from "../components/ui/Badge";
import Table from "../components/ui/Table";
import EmptyState from "../components/ui/EmptyState";
import customerService from "../services/customerService";
import productService from "../services/productService";
import orderService from "../services/orderService";

function CreateOrderPage() {
  // Form data
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);

  // Data
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // Loading and error states
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoadingCustomers(true);
      setLoadingProducts(true);
      setError(null);

      const [customersData, productsData] = await Promise.all([
        customerService.getAll(),
        productService.getAll(),
      ]);

      setCustomers(customersData);
      setProducts(productsData);
    } catch (err) {
      setError("Failed to load customers or products");
      console.error(err);
    } finally {
      setLoadingCustomers(false);
      setLoadingProducts(false);
    }
  };

  const getSelectedProduct = () => {
    return products.find((p) => p.id === parseInt(selectedProductId));
  };

  const getAvailableStock = () => {
    const product = getSelectedProduct();
    return product ? product.stock : 0;
  };

  const handleAddProduct = () => {
    if (!selectedProductId) {
      setError("Please select a product");
      return;
    }

    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    const product = getSelectedProduct();
    const availableStock = product.stock;

    if (quantity > availableStock) {
      setError(
        `Insufficient stock. Only ${availableStock} unit${
          availableStock !== 1 ? "s" : ""
        } available.`
      );
      return;
    }

    // Check if product already in order
    const existingItem = orderItems.find((item) => item.product_id === product.id);

    if (existingItem) {
      // Check if adding more quantity exceeds stock
      const totalQuantity = existingItem.quantity + quantity;
      if (totalQuantity > availableStock) {
        setError(
          `Cannot add ${quantity} more units. Total would be ${totalQuantity}, but only ${availableStock} available.`
        );
        return;
      }

      // Update existing item
      setOrderItems(
        orderItems.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: totalQuantity }
            : item
        )
      );
    } else {
      // Add new item
      setOrderItems([
        ...orderItems,
        {
          product_id: product.id,
          quantity: quantity,
          product: product,
        },
      ]);
    }

    // Reset form
    setSelectedProductId("");
    setQuantity(1);
    setError(null);
  };

  const handleRemoveItem = (productId) => {
    setOrderItems(orderItems.filter((item) => item.product_id !== productId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  };

  const handleSubmitOrder = async () => {
    if (!selectedCustomerId) {
      setError("Please select a customer");
      return;
    }

    if (orderItems.length === 0) {
      setError("Please add at least one product to the order");
      return;
    }

    try {
      setLoadingSubmit(true);
      setError(null);

      const orderData = {
        customer_id: parseInt(selectedCustomerId),
        items: orderItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      await orderService.create(orderData);

      setSuccessMessage("Order created successfully!");

      // Reset form
      setSelectedCustomerId("");
      setSelectedProductId("");
      setQuantity(1);
      setOrderItems([]);

      // Refresh products to update stock
      const updatedProducts = await productService.getAll();
      setProducts(updatedProducts);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        "Failed to create order. Please check inventory and try again.";
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingCustomers || loadingProducts) {
    return <Loader message="Loading order form..." />;
  }

  const orderTotal = calculateTotal();
  const selectedProduct = getSelectedProduct();
  const availableStock = getAvailableStock();

  const orderItemsColumns = [
    { key: "name", label: "Product Name" },
    { key: "price", label: "Unit Price" },
    { key: "quantity", label: "Quantity" },
    { key: "total", label: "Total" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Create Order
        </h1>
        <p className="text-gray-600 mt-2">
          Create a new order by selecting customer and products
        </p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card title="Select Customer">
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                setError(null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose a customer --</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
            {selectedCustomerId && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-gray-600">Selected Customer:</p>
                <p className="font-semibold text-gray-900">
                  {customers.find((c) => c.id === parseInt(selectedCustomerId))
                    ?.name}
                </p>
              </div>
            )}
          </Card>

          {/* Product Selection */}
          <Card title="Select Products">
            <div className="space-y-4">
              {/* Product Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose a product --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (₹{product.price}) - Stock: {product.stock}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Info */}
              {selectedProduct && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-600">Product Name</p>
                      <p className="font-medium text-gray-900">
                        {selectedProduct.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">SKU</p>
                      <p className="font-medium text-gray-900">
                        {selectedProduct.sku}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Unit Price</p>
                      <p className="font-semibold text-blue-600">
                        ₹{selectedProduct.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Available Stock</p>
                      <p className="font-semibold">
                        {availableStock}{" "}
                        <Badge
                          variant={
                            availableStock === 0
                              ? "danger"
                              : availableStock < 10
                              ? "warning"
                              : "success"
                          }
                          className="ml-1 inline-block"
                        >
                          {availableStock === 0
                            ? "Out of Stock"
                            : availableStock < 10
                            ? "Low Stock"
                            : "In Stock"}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setQuantity(Math.max(1, val));
                      setError(null);
                    }}
                    min="1"
                    max={availableStock}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter quantity"
                    disabled={!selectedProduct}
                  />
                  <Button
                    variant="primary"
                    onClick={handleAddProduct}
                    disabled={!selectedProductId || availableStock === 0}
                  >
                    Add to Order
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Section - Order Summary */}
        <div>
          <Card title="Order Summary">
            <div className="space-y-4">
              {/* Selected Items Count */}
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
                <span className="text-gray-700">Items Selected:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {orderItems.length}
                </span>
              </div>

              {/* Order Items List */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Products in Order
                </h4>
                {orderItems.length === 0 ? (
                  <EmptyState
                    icon="🛒"
                    title="No Items Yet"
                    message="Add products from the left panel."
                  />
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {orderItems.map((item) => (
                      <div
                        key={item.product_id}
                        className="p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              ₹{item.product.price} × {item.quantity}
                            </p>
                          </div>
                          <Button
                            variant="danger"
                            className="text-xs px-2 py-1"
                            onClick={() =>
                              handleRemoveItem(item.product_id)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm text-gray-600">
                            Total:
                          </span>
                          <span className="font-semibold text-gray-900">
                            ₹{item.product.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              {orderItems.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  {/* Subtotal */}
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-medium">₹{orderTotal}</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded">
                    <span className="font-semibold text-gray-900">
                      Order Total:
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{orderTotal}
                    </span>
                  </div>

                  {/* Submit Button */}
                  <Button
                    variant="success"
                    className="w-full"
                    onClick={handleSubmitOrder}
                    disabled={
                      loadingSubmit ||
                      !selectedCustomerId ||
                      orderItems.length === 0
                    }
                  >
                    {loadingSubmit ? "Creating Order..." : "Create Order"}
                  </Button>

                  {/* Clear Button */}
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      setOrderItems([]);
                      setSelectedProductId("");
                      setQuantity(1);
                      setError(null);
                    }}
                    disabled={loadingSubmit}
                  >
                    Clear Cart
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CreateOrderPage;