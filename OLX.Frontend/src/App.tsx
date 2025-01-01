import { Route, Routes } from 'react-router-dom'
import React, { Suspense } from 'react';
import './App.css'
import DefaultLayout from './components/layouts/default_layout/index';
import ProtectedRoutes from './components/protected_routes';

const ForgotPasswordPage = React.lazy(() => import('./pages/default/restore_password/password_forgot'));
const ResetPasswordPage = React.lazy(() => import('./pages/default/restore_password/password_reset'));
const EmailConfirmationPage = React.lazy(() => import('./pages/default/email_confirmation'));
const UsersPage = React.lazy(() => import('./pages/admin/users/index'));
const AdminLayout = React.lazy(() => import('./components/layouts/admin_layout/index'));
const HomePage = React.lazy(() => import('./pages/default/home'));
const NotFoundPage = React.lazy(() => import('./pages/default/errors/not_found_page'))
const LoginPage = React.lazy(() => import('./pages/default/login/index'));
const RegisterPage = React.lazy(() => import('./pages/default/register'));

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes requiredRole={["User", "UnAuth"]} />}>

        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="auth">
            <Route index element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="emailconfirm" element={<EmailConfirmationPage />} />
            <Route path="password">
              <Route index element={<ForgotPasswordPage />} />
              <Route path="reset" element={<ResetPasswordPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />

          <Route element={<ProtectedRoutes requiredRole={"User"} />}>
            <Route path="user">
             
            </Route>
          </Route>
        </Route>


      </Route>



      <Route element={<ProtectedRoutes requiredRole={"Admin"} />}>
        <Route path="/admin" element={
          <Suspense>
            <AdminLayout />
          </Suspense>}>
          <Route index element={<UsersPage />} />
          <Route path="*" element={<NotFoundPage />} />

        </Route>
      </Route>



    </Routes>
  )
}

export default App
