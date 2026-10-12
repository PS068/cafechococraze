import { Routes, Route, Navigate } from 'react-router-dom';
import PublicMenuPage from './pages/PublicMenuPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMenuItemsPage from './pages/admin/AdminMenuItemsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminQRCodePage from './pages/admin/AdminQRCodePage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import ToastContainer from './components/common/ToastContainer';

export default function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public digital menu routes */}
        <Route path="/" element={<PublicMenuPage />} />
        <Route path="/menu/:slug" element={<PublicMenuPage />} />

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="menu-items" element={<AdminMenuItemsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="qr-code" element={<AdminQRCodePage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        {/* Catch-all redirect to public menu */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
