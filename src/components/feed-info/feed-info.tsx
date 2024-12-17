import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from 'react-redux';
import {
  selectIsLoading,
  selectOrders,
  selectTotalOrders,
  selectTotalOrdersToday
} from '../../services/slices/feed/feedSlice';
import { Preloader } from '@ui';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получаем заказы и состояние загрузки из Redux
  const orders: TOrder[] = useSelector(selectOrders);
  const isLoading = useSelector(selectIsLoading);
  const total = useSelector(selectTotalOrders);
  const totalToday = useSelector(selectTotalOrdersToday);

  // Здесь подставляем актуальные данные для feed
  const feed = {
    total, // Общее количество заказов
    totalToday // Общее количество заказов за сегодня
  };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
