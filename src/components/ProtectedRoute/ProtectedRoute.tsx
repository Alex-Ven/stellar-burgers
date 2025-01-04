import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { Preloader } from '@ui';
import {
  selectUser,
  selectIsAuthChecked
} from '../../services/slices/user/userSlice';

type ProtectedRouteProps = {
  isNotLoginRoute?: boolean;
  children: React.ReactNode; //component: React.JSX.Element;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isNotLoginRoute,
  children
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked); // Флаг, который говорит, что проверка аутентификации завершена
  const user = useSelector(selectUser); // Данные пользователя

  //Если данные о пользователе еще загружаются
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если пользователь не авторизован и не на странице входа, перенаправляем на страницу входа
  if (!isNotLoginRoute && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }
  // Если пользователь не авторизован и на странице входа
  if (isNotLoginRoute && user) {
    const from = location.state?.from || { pathname: '/' }; // Редиректим на страницу, с которой пришел пользователь
    return <Navigate replace to={from} />;
  }

  // Если проверка прошла и данные о пользователе есть, рендерим дочерние компоненты
  return children;
};
