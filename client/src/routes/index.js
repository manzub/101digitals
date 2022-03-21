import { lazy } from "react"

const LandingPage = lazy(() => import('../pages/Landing'));
const LoginPage = lazy(() => import('../pages/auth/Login'));
const RegisterPage = lazy(() => import('../pages/auth/Register'));
const Chatroom = lazy(() => import('../pages/Chatroom'));
// dashboard
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Trade = lazy(() => import('../pages/dashboard/Trade'));
const Profile = lazy(() => import('../pages/dashboard/Profile'));
const BankInfo = lazy(() => import('../pages/dashboard/BankInfo'));
const Security = lazy(() => import('../pages/dashboard/Security'));
// superAdmin
const Services = lazy(() => import('../pages/dashboard/admin/Services'));
const Transactions = lazy(() => import('../pages/dashboard/admin/Transactions'));

const routes = [
  // home
  { path: '/', element: <LandingPage/>, exact: true },
  { path: '/login', element: <LoginPage/>, exact: true },
  { path: '/register', element: <RegisterPage/>, exact: true },
  { path: '/chatwith', element: <Chatroom/>, exact: true },
  // app routes
  { path: '/dashboard', element: <Dashboard/>, exact: true },
  { path: 'dashboard/trade', element: <Trade/>, exact: true },
  { path: 'dashboard/profile', element: <Profile/>, exact: true },
  { path: 'dashboard/bank-info', element: <BankInfo/>, exact: true },
  { path: 'dashboard/security', element: <Security/>, exact: true },
  // superAdmin routes
  { path: '/admin/services', element: <Services />, exact: true },
  { path: '/admin/transactions', element: <Transactions />, exact: true },
]

export default routes;