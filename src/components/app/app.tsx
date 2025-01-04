import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute';

import { fetchIngredients } from '../../services/slices/ingredients/ingredientsSlice';
import {
  checkUserAuth,
  selectIsAuth,
  selectIsAuthChecked
} from '../../services/slices/user/userSlice';
import { useDispatch, useSelector } from '../../services/store';

const App = () => {
  const navigate = useNavigate(); // Хук для навигации
  const location = useLocation(); // Хук для получения текущего местоположения
  const dispatch = useDispatch(); // Хук для dispatch экшенов

  // Извлекаем фоновое состояние из текущего местоположения
  const locationState = location.state as { background?: Location };
  const background = locationState && location.state?.background;

  // Проверка авторизации с использованием useSelector
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isAuth = useSelector(selectIsAuth); // Получаем значение авторизации

  // Закрытие модального окна (возврат на предыдущую страницу)
  const closeModal = () => {
    navigate(-1);
  };

  useEffect(() => {
    // Проверяем аутентификацию пользователя при старте приложения
    dispatch(checkUserAuth());
  }, [dispatch]);

  // Запрос ингредиентов при первом рендере
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основной рендер с проверкой фона */}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute isNotLoginRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute isNotLoginRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute isNotLoginRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute isNotLoginRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна для фоновых маршрутов */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={'Детали заказа'} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={'Детали заказа'} onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
