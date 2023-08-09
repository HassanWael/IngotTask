import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
  useParams
} from "react-router-dom";
import SignIn from './components/login/signIn';
import SignUp from './components/register/signUp';
import User from './components/user/user';
import AdminUser from './components/admin/adminUser';
import AdminLogin from './components/admin/adminLogin';
import { AuthProvider } from './components/context/AuthContext';
import 'bootstrap/dist/css/bootstrap.css';
const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/user",
    element: <User />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signup/:reffer",
    element: <SignUp/>,
  },
  // {
  //   path: "/admin/login",
  //   element: <AdminLogin />,
  // },
  {
    path: "/admin",
    element: <AdminUser />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

