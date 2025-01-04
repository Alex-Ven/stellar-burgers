import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI, Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  resetConstructor,
  selectBun,
  selectIngredients,
  selectOrderRequest,
  selectOrderModalData,
  takeOrder
} from '../../services/slices/burger/burgerSlice';
import { useNavigate } from 'react-router-dom';
import {
  checkUserAuth,
  selectError,
  selectIsAuth,
  selectIsAuthChecked,
  selectIsLoading
} from '../../services/slices/user/userSlice';

export const BurgerConstructor: FC = () => {
  const constructorBun = useSelector(selectBun); // Получаем булочку
  const constructorIngredients = useSelector(selectIngredients); // Получаем ингредиенты
  const orderRequest = useSelector(selectOrderRequest); // Исправил опечатку в селекторе
  const orderModalData = useSelector(selectOrderModalData);
  const isAuth = useSelector(selectIsAuth);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  // Проверяем, авторизован ли пользователь
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Проверяем аутентификацию при монтировании компонента
  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkUserAuth()); // Проверяем аутентификацию пользователя
    }
  }, [dispatch, isAuthChecked]);

  // Собираем все данные конструктора в один объект
  const constructorItems = {
    bun: constructorBun,
    ingredients: constructorIngredients || [] // Убедимся, что ингредиенты всегда массив
  };

  // Логика клика по кнопке оформления заказа
  const onOrderClick = () => {
    if (!isAuth) {
      return navigate('/login', { state: { from: window.location.pathname } }); // Если не авторизован, перенаправляем на страницу входа
    }
    if (!constructorItems.bun || orderRequest) return; // Если нет булочки или заказ уже в процессе, ничего не делаем

    // Формируем массив заказов
    const order = [
      constructorItems.bun?._id, // Добавляем булочку (только один раз)
      ...constructorItems.ingredients.map((ingredient) => ingredient._id), // Добавляем все ингредиенты
      constructorItems.bun?._id // Добавляем булочку в конце, если нужно
    ].filter(Boolean); // Очищаем массив от пустых значений (null, undefined)

    dispatch(takeOrder(order)); // Диспатчим заказ в Redux
  };

  // Закрытие модального окна с заказом
  const closeOrderModal = () => {
    dispatch(resetConstructor()); // Сбрасываем состояние конструктора
    navigate('/'); // Перенаправляем на главную страницу или другую нужную
  };

  // Рассчитываем цену с использованием useMemo для оптимизации
  const price = useMemo(() => {
    if (!constructorItems.bun || !constructorItems.ingredients) {
      return 0; // Если нет булочки или ингредиентов, возвращаем 0
    }
    return (
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) + // Цена булочки (умножаем на 2)
      constructorItems.ingredients.reduce(
        (total: number, ingredient: TConstructorIngredient) =>
          total + ingredient.price,
        0 // Складываем все цены ингредиентов
      )
    );
  }, [constructorItems]); // Перерасчет будет происходить только при изменении конструктора

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
