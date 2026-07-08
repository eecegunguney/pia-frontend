import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CustomerListPage from "../pages/customers/CustomerListPage";
import CustomerDetailPage from "../pages/customers/CustomerDetailModal";
import InventoryListPage from "../pages/inventory/InventoryListPage";
import ProductListPage from "../pages/products/ProductListPage";
import Layout from "../components/common/Layout";
import StockListPage from "../pages/stocks/StockListPage";
import CityPage from "../pages/analyses/city";
import CustomerTypePage from "../pages/analyses/customertype";
import FeedbackPage from "../pages/analyses/feedback";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

<Route
  path="/city"
  element={
    <ProtectedRoute>
      <Layout>
        <CityPage />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/customertype"
  element={
    <ProtectedRoute>
      <Layout>
        <CustomerTypePage />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/feedback"
  element={
    <ProtectedRoute>
      <Layout>
        <FeedbackPage />
      </Layout>
    </ProtectedRoute>
  }
/>

      <Route
        path="/customer"
        element={
          <ProtectedRoute>
            <Layout>
              <CustomerListPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <CustomerDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <Layout>
              <InventoryListPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Layout>
              <ProductListPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/stocks"
        element={
          <ProtectedRoute>
            <Layout>
              <StockListPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}