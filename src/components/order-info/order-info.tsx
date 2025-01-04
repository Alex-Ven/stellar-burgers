import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/feed/feedSlice';
import { selectIngredients } from '../../services/slices/ingredients/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { RootState } from '../../services/store';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const currentNumber = Number(useParams().number);

  // Получаем данные о заказах из Redux
  const orders = useSelector((state: RootState) => state.feed.orders);
  const ordersHistory = useSelector((state: RootState) => state.user.orders);
  const modalOrder = useSelector(
    (state: RootState) => state.feed.selectedModalOrder
  );

  // Получаем список ингредиентов
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  // Ищем заказ с нужным номером, используя логику поиска по orders, ordersHistory и modalOrder
  const orderData = useMemo(() => {
    // Ищем заказ в feeddata.orders и ordershistory.orders
    const foundInOrders = [...orders, ...ordersHistory].find(
      (order) => order.number === currentNumber
    );

    // Если заказ найден в списках, возвращаем его
    if (foundInOrders) return foundInOrders;

    // Если заказ не найден, проверяем modalOrder
    if (modalOrder && modalOrder.number === currentNumber) {
      return modalOrder;
    }

    // Если заказ не найден, возвращаем null
    return null;
  }, [orders, ordersHistory, modalOrder, currentNumber]);

  // Загружаем данные о заказе, если они еще не загружены
  useEffect(() => {
    if (!orderData) {
      dispatch(fetchOrderByNumber(currentNumber));
    }
  }, [dispatch, orderData, currentNumber]);

  // Мемоизация вычислений ингредиентов и общей стоимости
  const orderInfo = useMemo(() => {
    // Если данные еще не загружены, показываем Preloader
    if (!orderData || !ingredients.length) return;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Собираем информацию об ингредиентах из заказа, включая их количество
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          if (!acc[item]) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          } else {
            acc[item].count++;
          }
        }
        return acc;
      },
      {}
    );

    // Рассчитываем общую стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
