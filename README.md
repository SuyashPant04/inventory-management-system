# Inventory & Order Management System

A comprehensive full-stack web application for managing inventory, customers, and orders. Built with modern technologies including FastAPI, React, PostgreSQL, and Docker for seamless deployment and scalability.

## 🌟 Features

### Core Functionality
- **Product Management**: Create, read, update, and delete products with SKU tracking and inventory management
- **Customer Management**: Manage customer information with email validation and organization
- **Order Management**: Create and track orders with real-time inventory validation
- **Dashboard**: Comprehensive dashboard with key metrics and insights
  - Total products and customers count
  - Total orders and revenue tracking
  - Low stock alerts and product list
  - Responsive grid layout

### Advanced Features
- ✅ Real-time search functionality for products and customers
- ✅ Pagination support (10 items per page)
- ✅ Stock validation and inventory tracking
- ✅ Form validation with user feedback
- ✅ Modal-based CRUD operations
- ✅ Order details with nested items display
- ✅ Stock status badges and indicators
- ✅ Error handling and success notifications
- ✅ Loading states and empty states
- ✅ Responsive design with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI - Modern, fast web framework for building APIs
- **Database**: PostgreSQL - Robust relational database
- **ORM**: SQLAlchemy - SQL toolkit and object-relational mapper
- **Migrations**: Alembic - Database migration tool
- **Server**: Uvicorn - ASGI server

### Frontend
- **Framework**: React 19 - UI library with latest features
- **Build Tool**: Vite - Next-generation frontend tooling
- **Styling**: Tailwind CSS - Utility-first CSS framework
- **HTTP Client**: Axios - Promise-based HTTP client
- **Routing**: React Router 7 - Client-side routing
- **Icons**: Lucide React - Beautiful, consistent icon library
- **Linting**: ESLint - Code quality tool

### DevOps
- **Containerization**: Docker - Containerized deployment
- **Orchestration**: Docker Compose - Multi-container orchestration

## 📋 Project Structure

```
inventory-order-management-system/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application entry point
│   │   ├── config.py               # Configuration settings
│   │   ├── database.py             # Database connection setup
│   │   ├── models/                 # SQLAlchemy models
│   │   │   ├── customer.py
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   └── order_item.py
│   │   ├── routes/                 # API route handlers
│   │   │   ├── product_routes.py
│   │   │   ├── customer_routes.py
│   │   │   ├── order_routes.py
│   │   │   └── dashboard_routes.py
│   │   ├── schemas/                # Pydantic validation schemas
│   │   ├── services/               # Business logic layer
│   │   ├── dependencies/           # Dependency injection
│   │   └── utils/                  # Utility functions
│   ├── alembic/                    # Database migrations
│   ├── tests/                      # Backend tests
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Backend containerization
│   └── alembic.ini                 # Alembic configuration
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                # React entry point
│   │   ├── App.jsx                 # Root component
│   │   ├── components/
│   │   │   ├── layout/             # Layout components (AppLayout, Sidebar)
│   │   │   ├── ui/                 # Reusable UI components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── EmptyState.jsx
│   │   │   ├── forms/              # Form components
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   └── CustomerForm.jsx
│   │   │   └── modals/             # Modal components
│   │   │       └── OrderDetailsModal.jsx
│   │   ├── pages/                  # Page components
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── CustomersPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   └── CreateOrderPage.jsx
│   │   ├── services/               # API integration layer
│   │   │   ├── api.js
│   │   │   ├── productService.js
│   │   │   ├── customerService.js
│   │   │   ├── orderService.js
│   │   │   └── dashboardService.js
│   │   └── styles/                 # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile                  # Frontend containerization
│   └── index.html
│
├── docker-compose.yml              # Multi-container orchestration
├── README.md                       # This file
└── IMPLEMENTATION_SUMMARY.md       # Detailed implementation notes
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- PostgreSQL (v16 or higher) OR Docker & Docker Compose
- npm or yarn (for frontend package management)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd inventory-order-management-system
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create a .env file with your database configuration
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file if needed for API configuration
```

## 💻 Running the Application

### Option 1: Local Development (Without Docker)

#### Start Backend
```bash
cd backend

# Ensure virtual environment is activated
# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

#### Start Frontend (in a new terminal)
```bash
cd frontend

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Option 2: Docker Compose (Recommended)

```bash
# Navigate to project root
cd inventory-order-management-system

# Build and start all services
docker-compose up -d

# View logs (optional)
docker-compose logs -f
```

Services will be available at:
- **Frontend**: http://localhost:3000 (or check docker-compose for assigned port)
- **Backend API**: http://localhost:8000
- **Database**: localhost:5432

Stop the services:
```bash
docker-compose down
```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main API Endpoints

#### Products
- `GET /products` - Get all products
- `GET /products/{id}` - Get product by ID
- `GET /products/search/{query}` - Search products
- `POST /products` - Create new product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

#### Customers
- `GET /customers` - Get all customers
- `GET /customers/{id}` - Get customer by ID
- `POST /customers` - Create new customer
- `PUT /customers/{id}` - Update customer
- `DELETE /customers/{id}` - Delete customer

#### Orders
- `GET /orders` - Get all orders
- `GET /orders/{id}` - Get order by ID
- `POST /orders` - Create new order
- `GET /orders/customer/{customer_id}` - Get customer orders

#### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

## 🔧 Development

### Frontend Commands

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Backend Commands

```bash
cd backend

# Run tests
pytest

# Create new database migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Revert to previous migration
alembic downgrade -1
```

## 🏗️ Database Schema

### Tables

- **Products**: SKU, name, price, stock quantity
- **Customers**: Name, email contact information
- **Orders**: Customer reference, order total, timestamps
- **OrderItems**: Order reference, product reference, quantity, line total

## 📦 Deployment

### Docker Build

Build individual services:
```bash
# Build backend
docker build -t inventory-backend:latest ./backend

# Build frontend
docker build -t inventory-frontend:latest ./frontend
```

### Environment Variables

Create `.env` file in the backend directory:
```
DATABASE_URL=postgresql://user:password@db:5432/inventory_db
DEBUG=False
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests (if configured)
```bash
cd frontend
npm run test
```

## 📖 Additional Documentation

- [Frontend README](frontend/FRONTEND_README.md) - Detailed frontend setup and component guide
- [Components Documentation](frontend/COMPONENTS.md) - Detailed component API and usage
- [Quick Reference](frontend/QUICK_REFERENCE.md) - Quick reference for common tasks
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Complete implementation details

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL environment variable
- Verify credentials in .env file

### Port Already in Use
- Change the port in docker-compose.yml or uvicorn command
- Check for other services running on the same port

### CORS Errors
- Backend is configured to accept requests from all origins
- Verify frontend is making requests to the correct backend URL

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Last Updated**: May 29, 2026