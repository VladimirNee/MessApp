import { useContext } from "react";
import { AccountContext } from "./AccountContext";

import { Outlet, Navigate } from 'react-router'

const useAuth = () => {
  const { user } = useContext(AccountContext);
  console.log('user', user)

  return user && user.loggedIn;
};

const PrivateRoutes = () => {
  const isAuth = useAuth();
  console.log('isAuth', isAuth)
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
