import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import Modal from "../components/ui/Modal";
import Table from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import ProductForm from "../components/forms/ProductForm";
import productService from "../services/productService";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      setCurrentPage(1);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleAddProduct = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await productService.create(formData);
      setSuccessMessage("Product added successfully!");
      setShowAddModal(false);
      fetchProducts();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to add product. SKU might already exist."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await productService.update(selectedProduct.id, formData);
      setSuccessMessage("Product updated successfully!");
      setShowEditModal(false);
      setSelectedProduct(null);
      fetchProducts();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to update product. SKU might already exist."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await productService.delete(selectedProduct.id);
      setSuccessMessage("Product deleted successfully!");
      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchProducts();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to delete product");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <Badge variant="danger">Out of Stock</Badge>;
    } else if (stock < 10) {
      return <Badge variant="warning">Low Stock</Badge>;
    } else {
      return <Badge variant="success">In Stock</Badge>;
    }
  };

  if (loading) {
    return <Loader message="Loading products..." />;
  }

  const columns = [
    { key: "name", label: "Product Name" },
    { key: "sku", label: "SKU" },
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your product inventory
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add Product
        </Button>
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

      {/* Search */}
      <Card>
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </Card>

      {/* Products Table */}
      <Card>
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No Products Found"
            message="Start by adding your first product to the inventory."
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={paginatedProducts}
              renderRow={(product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.sku}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    ₹{product.price}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium">
                        {product.stock}
                      </span>
                      {getStockBadge(product.stock)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        className="text-sm px-3 py-1"
                        onClick={() =>
                          handleOpenEditModal(product)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="text-sm px-3 py-1"
                        onClick={() =>
                          handleOpenDeleteModal(product)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredProducts.length)}{" "}
                  of {filteredProducts.length} products
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

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        title="Add New Product"
        onClose={() => {
          setShowAddModal(false);
          setError(null);
        }}
      >
        <ProductForm
          onSubmit={handleAddProduct}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditModal}
        title="Edit Product"
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
          setError(null);
        }}
      >
        {selectedProduct && (
          <ProductForm
            product={selectedProduct}
            onSubmit={handleEditProduct}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        title="Delete Product"
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProduct(null);
          setError(null);
        }}
        onConfirm={handleDeleteProduct}
        confirmText="Delete"
        isDangerous={true}
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{selectedProduct?.name}</strong>? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}

export default ProductsPage;