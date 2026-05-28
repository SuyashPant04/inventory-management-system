import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import Modal from "../components/ui/Modal";
import Table from "../components/ui/Table";
import EmptyState from "../components/ui/EmptyState";
import CustomerForm from "../components/forms/CustomerForm";
import customerService from "../services/customerService";

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchQuery]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      setError("Failed to load customers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
      setCurrentPage(1);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query)
    );
    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  const handleAddCustomer = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await customerService.create(formData);
      setSuccessMessage("Customer added successfully!");
      setShowAddModal(false);
      fetchCustomers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to add customer. Email might already exist."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCustomer = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await customerService.update(selectedCustomer.id, formData);
      setSuccessMessage("Customer updated successfully!");
      setShowEditModal(false);
      setSelectedCustomer(null);
      fetchCustomers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to update customer. Email might already exist."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await customerService.delete(selectedCustomer.id);
      setSuccessMessage("Customer deleted successfully!");
      setShowDeleteModal(false);
      setSelectedCustomer(null);
      fetchCustomers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to delete customer");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <Loader message="Loading customers..." />;
  }

  const columns = [
    { key: "name", label: "Customer Name" },
    { key: "email", label: "Email" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Customers
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your customer information
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add Customer
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
          placeholder="Search by customer name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </Card>

      {/* Customers Table */}
      <Card>
        {filteredCustomers.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No Customers Found"
            message="Start by adding your first customer to the system."
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={paginatedCustomers}
              renderRow={(customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {customer.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {customer.email}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        className="text-sm px-3 py-1"
                        onClick={() =>
                          handleOpenEditModal(customer)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="text-sm px-3 py-1"
                        onClick={() =>
                          handleOpenDeleteModal(customer)
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
                  {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}{" "}
                  of {filteredCustomers.length} customers
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

      {/* Add Customer Modal */}
      <Modal
        isOpen={showAddModal}
        title="Add New Customer"
        onClose={() => {
          setShowAddModal(false);
          setError(null);
        }}
      >
        <CustomerForm
          onSubmit={handleAddCustomer}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={showEditModal}
        title="Edit Customer"
        onClose={() => {
          setShowEditModal(false);
          setSelectedCustomer(null);
          setError(null);
        }}
      >
        {selectedCustomer && (
          <CustomerForm
            customer={selectedCustomer}
            onSubmit={handleEditCustomer}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        title="Delete Customer"
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCustomer(null);
          setError(null);
        }}
        onConfirm={handleDeleteCustomer}
        confirmText="Delete"
        isDangerous={true}
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{selectedCustomer?.name}</strong>? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}

export default CustomersPage;