# Frontend Quick Reference Guide

## 🎯 Common Tasks

### Add a New Page

1. Create page component in `src/pages/NewPage.jsx`
2. Import components and services
3. Add route in `src/App.jsx`
4. Add navigation link in `src/components/layout/Sidebar.jsx`

```jsx
// src/App.jsx
<Route path="/new-page" element={<NewPage />} />

// src/components/layout/Sidebar.jsx
<NavLink to="/new-page" className={linkClass}>
  New Page
</NavLink>
```

### Add a New Component

1. Create component in appropriate folder:
   - UI components → `src/components/ui/`
   - Forms → `src/components/forms/`
   - Modals → `src/components/modals/`

2. Export from index file:
   ```jsx
   // src/components/ui/index.js
   export { default as NewComponent } from "./NewComponent";
   ```

3. Use in pages:
   ```jsx
   import { NewComponent } from "@/components/ui";
   ```

### Fetch Data from API

```jsx
import { useEffect, useState } from "react";
import productService from "@/services/productService";

function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await productService.getAll();
      setData(result);
    } catch (err) {
      setError("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return <div>{/* render data */}</div>;
}
```

### Create a Form

```jsx
import { useState } from "react";
import { Button } from "@/components/ui";

function MyForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded"
      />
      {errors.name && <p className="text-red-500">{errors.name}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Submit"}
      </Button>
    </form>
  );
}
```

### Open a Modal

```jsx
import { useState } from "react";
import { Modal, Button } from "@/components/ui";

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Open Modal</Button>

      <Modal
        isOpen={showModal}
        title="My Modal"
        onClose={() => setShowModal(false)}
      >
        Modal content here
      </Modal>
    </>
  );
}
```

### Display a Table

```jsx
import { Table } from "@/components/ui";

function MyTable({ data }) {
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      renderRow={(row) => (
        <tr key={row.id}>
          <td className="px-4 py-3">{row.name}</td>
          <td className="px-4 py-3">{row.email}</td>
        </tr>
      )}
    />
  );
}
```

---

## 📝 Common Code Patterns

### Loading Pattern
```jsx
if (loading) return <Loader message="Loading..." />;
if (error) return <div className="text-red-600">{error}</div>;
if (data.length === 0) return <EmptyState />;
```

### Success Message Pattern
```jsx
const [successMessage, setSuccessMessage] = useState(null);

// Show message
setSuccessMessage("Operation successful!");

// Auto-dismiss after 3 seconds
setTimeout(() => setSuccessMessage(null), 3000);

// In JSX
{successMessage && (
  <div className="bg-green-100 text-green-700 p-3 rounded">
    {successMessage}
  </div>
)}
```

### Modal + Form Pattern
```jsx
const [showModal, setShowModal] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (formData) => {
  try {
    setIsSubmitting(true);
    await apiService.create(formData);
    setShowModal(false);
    refetchData();
  } finally {
    setIsSubmitting(false);
  }
};

<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
  <MyForm onSubmit={handleSubmit} isLoading={isSubmitting} />
</Modal>
```

### Pagination Pattern
```jsx
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
const totalPages = Math.ceil(items.length / itemsPerPage);
const paginatedItems = items.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

// Navigation buttons
<Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
  Previous
</Button>
<Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
  Next
</Button>
```

### Search/Filter Pattern
```jsx
const [searchQuery, setSearchQuery] = useState("");
const [filteredItems, setFilteredItems] = useState([]);

useEffect(() => {
  if (!searchQuery) {
    setFilteredItems(items);
    return;
  }
  
  const query = searchQuery.toLowerCase();
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query)
  );
  setFilteredItems(filtered);
}, [items, searchQuery]);

<input
  type="text"
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

---

## 🎨 Tailwind CSS Cheat Sheet

### Spacing
```
p-2 (padding: 0.5rem)
p-4 (padding: 1rem)
m-2 (margin: 0.5rem)
gap-4 (gap: 1rem)
space-y-4 (vertical space)
```

### Colors
```
text-red-600 (text color)
bg-blue-50 (background light)
border-gray-300 (border)
hover:bg-gray-100 (hover state)
```

### Layout
```
flex (flexbox)
grid grid-cols-3 (grid with 3 columns)
w-full (width 100%)
h-screen (height 100vh)
```

### Responsive
```
md:grid-cols-2 (2 columns on medium screens)
lg:col-span-3 (3 columns on large screens)
```

---

## 🔧 Component Props Reference

### Button
```jsx
<Button
  variant="primary" | "secondary" | "danger" | "success" | "outline"
  onClick={handleClick}
  disabled={isLoading}
  type="button" | "submit" | "reset"
  className="additional classes"
>
  Button Text
</Button>
```

### Card
```jsx
<Card title="Optional Title" className="custom-class">
  Card content
</Card>
```

### Badge
```jsx
<Badge variant="success" | "danger" | "warning" | "info" | "default">
  Badge Text
</Badge>
```

### Modal
```jsx
<Modal
  isOpen={boolean}
  title="Modal Title"
  onClose={function}
  onConfirm={function}
  confirmText="Confirm"
  cancelText="Cancel"
  isDangerous={boolean}
>
  Modal content
</Modal>
```

### Table
```jsx
<Table
  columns={[{key: "id", label: "ID"}, {key: "name", label: "Name"}]}
  data={arrayOfObjects}
  renderRow={(row) => <tr>...</tr>}
/>
```

### Loader
```jsx
<Loader message="Custom loading message" />
```

### EmptyState
```jsx
<EmptyState
  icon="📭"
  title="No Items"
  message="No items to display"
/>
```

---

## 🚨 Error Handling

### API Error Handling
```jsx
try {
  const data = await productService.create(formData);
} catch (err) {
  const errorMsg = err.response?.data?.detail || "Failed to create";
  setError(errorMsg);
}
```

### Validation Error Handling
```jsx
const validateForm = () => {
  const newErrors = {};
  if (!form.name) newErrors.name = "Name required";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

## 📊 Data Structure Examples

### Product
```javascript
{
  id: 1,
  name: "Wireless Mouse",
  sku: "WMOUSE-001",
  price: 799,
  stock: 45
}
```

### Customer
```javascript
{
  id: 1,
  name: "John Doe",
  email: "john@example.com"
}
```

### Order
```javascript
{
  id: 1,
  customer_id: 1,
  total_amount: 3597,
  customer: { id: 1, name: "John Doe", email: "john@example.com" },
  items: [
    {
      id: 1,
      product_id: 1,
      quantity: 2,
      unit_price: 799,
      product: { id: 1, name: "Wireless Mouse", price: 799 }
    }
  ]
}
```

---

## 🔗 Service Methods

### Product Service
```javascript
productService.getAll()
productService.getById(id)
productService.search(query)
productService.create(data)
productService.update(id, data)
productService.delete(id)
```

### Customer Service
```javascript
customerService.getAll()
customerService.getById(id)
customerService.create(data)
customerService.update(id, data)
customerService.delete(id)
```

### Order Service
```javascript
orderService.getAll()
orderService.getById(id)
orderService.create(data)
```

### Dashboard Service
```javascript
dashboardService.getStats()
```

---

## 🐛 Debugging Tips

### Check Console
```bash
npm run dev
# Open browser console (F12)
# Check for errors and warnings
```

### React DevTools
1. Install React DevTools extension
2. Inspect components and state
3. Track re-renders

### Network Tab
1. Open DevTools → Network tab
2. Check API calls
3. Verify request/response

### React Hooks Debugging
```jsx
console.log('Current state:', data);
console.log('Dependencies:', [dependencies]);
```

---

## 📦 Imports Reference

### Components
```javascript
import { Button, Card, Loader } from "@/components/ui";
import { ProductForm } from "@/components/forms";
import { OrderDetailsModal } from "@/components/modals";
```

### Services
```javascript
import productService from "@/services/productService";
import customerService from "@/services/customerService";
import orderService from "@/services/orderService";
import dashboardService from "@/services/dashboardService";
```

### React
```javascript
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
```

---

## 🎯 Performance Tips

- Use `useCallback` for memoized callbacks
- Avoid inline function definitions in JSX
- Lazy load heavy components with `React.lazy()`
- Use proper keys in lists
- Minimize re-renders with proper dependencies

---

## ✅ Testing Checklist

Before deploying:
- [ ] All pages load without errors
- [ ] Forms validate correctly
- [ ] CRUD operations work
- [ ] Search/filters work
- [ ] Pagination works
- [ ] Error messages display
- [ ] Loading states show
- [ ] API calls complete successfully
- [ ] Responsive design works on mobile
- [ ] No console errors

---

## 📞 Support

For issues or questions:
1. Check component documentation
2. Review similar implementations
3. Check browser console for errors
4. Verify API is running and accessible
