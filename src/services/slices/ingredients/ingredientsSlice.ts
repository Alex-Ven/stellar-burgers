import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../../utils/burger-api';
import { RootState } from '../../store';

// Типы состояния
interface IngredientsState {
  items: TIngredient[]; // Массив ингредиентов
  loading: boolean; // Состояние загрузки
  error: string | null; // Ошибка, если есть
}

// Начальное состояние
export const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

// Асинхронная thunk-функция для получения ингредиентов
export const fetchIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/fetchIngredients',
  async () => {
    const response = await getIngredientsApi(); // Вызов API
    return response; // Возвращаем данные
  }
);

// Создаем слайс
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || 'Ошибка загрузки ингредиентов';
      });
  }
});

// Экспортируем редюсеры и селекторы
export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectLoading = (state: RootState) => state.ingredients.loading;
export const selectError = (state: RootState) => state.ingredients.error;

export default ingredientsSlice.reducer;
