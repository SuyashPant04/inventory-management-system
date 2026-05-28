# Reusable Components Documentation

## Overview
This document provides a comprehensive guide to all reusable components in the Inventory & Order Management System frontend.

---

## UI Components (`src/components/ui/`)

### 1. **Button**
Reusable button component with multiple variants.

**Props:**
- `children` (required): Button text/content
- `type`: "button" | "submit" | "reset" (default: "button")
- `onClick`: Click handler function
- `variant`: "primary" | "secondary" | "danger" | "success" | "outline" (default: "primary")
- `disabled`: Boolean (default: false)
- `className`: Additional Tailwind classes

**Example:**
```jsx
import { Button } from "@/components";

<Button variant="primary" onClick={handleClick}>
  Submit
</Button>

<Button variant="danger" disabled={isLoading}>
  Delete
</Button>

<Button variant="outline">
  Cancel
</Button>
```

---

### 2. **Card**
Wrapper component for creating white cards with shadow.

**Props:**
- `children` (required): Card content
- `title`: Optional title displayed at top
- `className`: Additional Tailwind classes

**Example:**
```jsx
import { Card } from "@/components";

<Card title="User Information">
  <p>Card content here</p>
</Card>

<Card className="bg-blue-50">
  <h3>Custom styled card</h3>
</Card>
```

---

### 3. **Badge**
Status badge component with color variants.

**Props:**
- `children` (required): Badge text
- `variant`: "default" | "success" | "danger" | "warning" | "info" (default: "default")
- `className`: Additional Tailwind classes

**Example:**
```jsx
import { Badge } from "@/components";

<Badge variant="success">In Stock</Badge>
<Badge variant="danger">Out of Stock</Badge>
<Badge variant="warning">Low Stock</Badge>
```

---

### 4. **Modal**
Reusable modal dialog component with optional confirmation.

**Props:**
- `isOpen` (required): Boolean to show/hide modal
- `title` (required): Modal title
- `children` (required): Modal content
- `onClose` (required): Close handler function
- `onConfirm`: Optional confirmation handler
- `confirmText`: Confirmation button text (default: "Confirm")
- `cancelText`: Cancel button text (default: "Cancel")
- `isDangerous`: Boolean for danger variant (red button) (default: false)

**Example:**
```jsx
import { Modal } from "@/components";

<Modal
  isOpen={showModal}
  title="Confirm Delete"
  onClose={() => setShowModal(false)}
  onConfirm={handleDelete}
  confirmText="Delete"
  isDangerous={true}
>
  Are you sure you want to delete this item?
</Modal>
```

---

### 5. **Table**
Flexible data table component for displaying tabular data.

**Props:**
- `columns` (required): Array of {key, label} objects
- `data` (required): Array of data objects
- `renderRow` (required): Function to render each row
- `className`: Additional Tailwind classes

**Example:**
```jsx
import { Table } from "@/components";

<Table
  columns={[
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "actions", label: "Actions" },
  ]}
  data={customers}
  renderRow={(customer) => (
    <tr key={customer.id}>
      <td className="px-4 py-3">{customer.name}</td>
      <td className="px-4 py-3">{customer.email}</td>
      <td className="px-4 py-3">
        <Button>Edit</Button>
      </td>
    </tr>
  )}
/>
```

---

### 6. **Loader**
Loading spinner component with optional message.

**Props:**
- `message`: Loading message text (default: "Loading...")

**Example:**
```jsx
import { Loader } from "@/components";

<Loader message="Loading products..." />
```

---

### 7. **EmptyState**
Empty state display component for when no data is available.

**Props:**
- `icon`: Emoji icon (default: "📭")
- `title`: Title text (default: "No data found")
- `message`: Description message (default: "There are no items to display.")

**Example:**
```jsx
import { EmptyState } from "@/components";

<EmptyState
  icon="🛒"
  title="No Items Yet"
  message="Add products to get started."
/>
```

---

## Form Components (`src/components/forms/`)

### 1. **ProductForm**
Form component for creating and editing products.

**Props:**
- `product`: Optional product object for editing mode
- `onSubmit` (required): Callback function with form data (receives {name, sku, price, stock})
- `isLoading`: Boolean for loading state (default: false)

**Features:**
- Input fields: name, sku, price, stock
- Real-time validation with error messages
- Validates: required fields, positive price, non-negative stock
- Loading state handling

**Example:**
```jsx
import { ProductForm } from "@/components";

<ProductForm
  onSubmit={(formData) => handleCreate(formData)}
  isLoading={isSubmitting}
/>

// For editing
<ProductForm
  product={selectedProduct}
  onSubmit={(formData) => handleUpdate(formData)}
  isLoading={isSubmitting}
/>
```

---

### 2. **CustomerForm**
Form component for creating and editing customers.

**Props:**
- `customer`: Optional customer object for editing mode
- `onSubmit` (required): Callback function with form data (receives {name, email})
- `isLoading`: Boolean for loading state (default: false)

**Features:**
- Input fields: name, email
- Real-time validation with error messages
- Email format validation using regex
- Loading state handling

**Example:**
```jsx
import { CustomerForm } from "@/components";

<CustomerForm
  onSubmit={(formData) => handleCreate(formData)}
  isLoading={isSubmitting}
/>
```

---

## Modal Components (`src/components/modals/`)

### 1. **OrderDetailsModal**
Detailed order view modal displaying complete order information.

**Props:**
- `isOpen` (required): Boolean to show/hide modal
- `order`: Order object to display (can be null)
- `onClose` (required): Close handler function

**Displays:**
- Order ID and total amount
- Customer information (name, email)
- Nested order items table
- Order summary with total

**Example:**
```jsx
import { OrderDetailsModal } from "@/components";

<OrderDetailsModal
  isOpen={showDetails}
  order={selectedOrder}
  onClose={() => setShowDetails(false)}
/>
```

---

## Import Patterns

### Using Index Files (Recommended)
```jsx
// Clean imports using index files
import { Button, Card, Loader, Badge } from "@/components/ui";
import { ProductForm, CustomerForm } from "@/components/forms";
import { OrderDetailsModal } from "@/components/modals";

// Or from root index
import {
  Button,
  Card,
  Loader,
  ProductForm,
  OrderDetailsModal,
} from "@/components";
```

### Direct Imports
```jsx
// Or import directly from files
import Button from "@/components/ui/Button";
import ProductForm from "@/components/forms/ProductForm";
```

---

## Tailwind CSS Classes Used

### Button Variants
- **primary**: `bg-blue-600 hover:bg-blue-700`
- **secondary**: `bg-gray-600 hover:bg-gray-700`
- **danger**: `bg-red-600 hover:bg-red-700`
- **success**: `bg-green-600 hover:bg-green-700`
- **outline**: `border border-blue-600 hover:bg-blue-50`

### Badge Variants
- **default**: `bg-blue-100 text-blue-800`
- **success**: `bg-green-100 text-green-800`
- **danger**: `bg-red-100 text-red-800`
- **warning**: `bg-yellow-100 text-yellow-800`
- **info**: `bg-indigo-100 text-indigo-800`

---

## Folder Structure

```
src/components/
├── ui/
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Badge.jsx
│   ├── Loader.jsx
│   ├── Modal.jsx
│   ├── Table.jsx
│   ├── EmptyState.jsx
│   └── index.js (exports all UI components)
├── forms/
│   ├── ProductForm.jsx
│   ├── CustomerForm.jsx
│   └── index.js (exports all form components)
├── modals/
│   ├── OrderDetailsModal.jsx
│   └── index.js (exports all modal components)
├── layout/
│   ├── AppLayout.jsx
│   └── Sidebar.jsx
└── index.js (exports all components)
```

---

## Component Composition Example

```jsx
import { useState } from "react";
import {
  Button,
  Card,
  Modal,
  Loader,
  EmptyState,
  ProductForm,
} from "@/components";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <Card title="Products">
        {loading ? (
          <Loader message="Loading products..." />
        ) : products.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No Products"
            message="Add your first product"
          />
        ) : (
          <div>
            {/* Table/List content */}
          </div>
        )}
      </Card>

      <Modal
        isOpen={showModal}
        title="Add Product"
        onClose={() => setShowModal(false)}
      >
        <ProductForm
          onSubmit={(data) => {
            // Handle submit
            setShowModal(false);
          }}
          isLoading={loading}
        />
      </Modal>

      <Button onClick={() => setShowModal(true)}>
        Add Product
      </Button>
    </div>
  );
}
```

---

## Best Practices

1. **Always use index files** for cleaner imports
2. **Pass className prop** for custom Tailwind styling when needed
3. **Handle loading states** in parent components, pass `isLoading` to components
4. **Use semantic HTML** - components use proper form elements, buttons, etc.
5. **Accessibility** - all components support standard HTML attributes
6. **Props spreading** - components use `...props` to accept additional attributes
7. **Proper error handling** - validate form data before submission
8. **Loading feedback** - show loading states during async operations

---

## Summary

This component library provides:
- **7 UI Components** for common UI patterns
- **2 Form Components** for data entry
- **1 Modal Component** for detail views
- **100% Tailwind CSS** styling (no external libraries)
- **Easy composition** for building complex UIs
- **Consistent design** across the entire application
