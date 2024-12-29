import { Route, Routes } from 'react-router-dom'
import React, { Suspense } from 'react';
import './App.css'
import DefaultLayout from './components/layout/index';


const ForgotPasswordPage = React.lazy(() => import( './pages/restore_password/password_forgot'));
const ResetPasswordPage = React.lazy(() => import('./pages/restore_password/password_reset'));
const EmailConfirmationPage = React.lazy(() => import('./pages/email_confirmation'));
const UsersPage = React.lazy(() => import('./admin_panel/pages/users/index'));
const AdminLayout = React.lazy(() => import('./admin_panel/layout/index'));
const HomePage = React.lazy(() => import('./pages/home'));
const ErrorPage = React.lazy(() => import('./pages/error'))
const LoginPage = React.lazy(() => import('./pages/login/index'));
const RegisterPage = React.lazy(() => import('./pages/register'));






function App() {

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="emailconfirm" element={<EmailConfirmationPage />} />
        <Route path="password/forgot" element={<ForgotPasswordPage />} />
        <Route path="password/reset" element={<ResetPasswordPage />} />
      </Route>

      <Route path="admin" element={<Suspense><AdminLayout /></Suspense>}>
          <Route index element={<UsersPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>


      <Route path="*" element={
        <ErrorPage
          status="404"
          title="404"
          subTitle="Вибачте, сторінка на яку ви намагаєтесь перейти не існує."
        />} />
    </Routes>
  )
}

export default App
