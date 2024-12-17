import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  fetchFeedsData,
  selectIsLoading,
  selectOrders
} from '../../services/slices/feed/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const orders: TOrder[] = useSelector(selectOrders);

  useEffect(() => {
    dispatch(fetchFeedsData());
  }, [dispatch]);

  // Если заказов нет, отображаем сообщение
  if (isLoading) {
    return <Preloader />;
  }

  const handleGetOrders = () => {
    dispatch(fetchFeedsData());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetOrders} />;
};
