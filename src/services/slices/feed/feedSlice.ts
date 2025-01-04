import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getFeedsApi,
  getOrderByNumberApi,
  TOrderResponse
} from '../../../utils/burger-api';
import { RootState } from '../../store';

interface FeedState {
  orders: TOrder[];
  selectedModalOrder: TOrder | null;
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  selectedModalOrder: null,
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

// Асинхронные Thunk-функции

// Получение всех заказов
export const fetchFeedsData = createAsyncThunk('feeds/data', async () =>
  getFeedsApi()
);

// Получение заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'feed/fetchOrderByNumber',
  async (number: number) => {
    const response: TOrderResponse = await getOrderByNumberApi(number);
    return response; // Возвращаем первый заказ из массива
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearselectedModalOrder(state) {
      state.selectedModalOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Загрузка всех заказов
      .addCase(fetchFeedsData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedsData.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      })
      .addCase(fetchFeedsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка получения заказов';
      })

      // Загрузка заказа по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrderResponse>) => {
          state.isLoading = false;
          state.selectedModalOrder = action.payload.orders[0];
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка получения заказа';
      });
  }
});

// Экспортируем экшены
export const { clearselectedModalOrder } = feedSlice.actions;

// Экспортируем селекторы
export const selectOrders = (state: RootState) => state.feed.orders;
export const selectselectedModalOrder = (state: RootState) =>
  state.feed.selectedModalOrder;
export const selectTotalOrders = (state: RootState) => state.feed.total;
export const selectTotalOrdersToday = (state: RootState) =>
  state.feed.totalToday;
export const selectIsLoading = (state: RootState) => state.feed.isLoading;
export const selectError = (state: RootState) => state.feed.error;

// Экспортируем редюсер
export default feedSlice.reducer;
