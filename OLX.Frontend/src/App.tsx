import { Route, Routes } from 'react-router-dom'
import React, { Suspense } from 'react';
import './App.css'
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { isAdmin } from './store/slices/userSlice';
import DefaultLayout from './components/layouts/default';

const UsersPage = React.lazy(() => import('./admin_panel/pages/users/index'));
const AdminLayout = React.lazy(() => import('./admin_panel/layout/index'));
const HomePage = React.lazy(() => import('./pages/home'));
const ErrorPage = React.lazy(() => import('./pages/error'))
const LoginPage = React.lazy(() => import('./admin_panel/pages/users'));
const RegisterPage = React.lazy(() => import('./pages/register'));






function App() {
  const admin: boolean = useSelector((state: RootState) => isAdmin(state))
  return (
    <Routes>
     
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
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
