import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { RootState } from '../../../services/store';
import { orderBurgerApi } from '@api';

// Типы состояния
interface ConstructorState {
  bun: TConstructorIngredient | null; // Булка (может быть null, если не выбрана)
  ingredients: TConstructorIngredient[]; // Массив ингредиентов

  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
  error: null | string | undefined;
}

// Начальное состояние
export const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  loading: true,
  error: null
};

// Асинхронный экшен для отправки заказа
export const takeOrder = createAsyncThunk(
  'order/takeOrder',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

// Создаем слайс
const constructorSlice = createSlice({
  name: 'burgerconstructor',
  initialState,
  reducers: {
    // Добавляем ингредиент в конструктор
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;

        // Если это булка, заменяем булку, если нет — добавляем в ingredients
        if (ingredient.type === 'bun') {
          state.bun = ingredient; // Если это булка, заменяем булку
        } else {
          // Проверяем, что ingredients существует (не undefined)
          if (!state.ingredients) {
            state.ingredients = []; // Если вдруг ingredients не определен, инициализируем его
          }
          state.ingredients.push(ingredient); // Иначе добавляем в массив ингредиентов
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: `${ingredient._id}_${Date.now()}` // Генерация уникального ID на основе _id ингредиента и текущего времени
        }
      })
    },
    // Удаляем ингредиент по ID
    removeIngredient(state, action: PayloadAction<string>) {
      // Если ingredients существует, фильтруем и удаляем ингредиент по ID
      if (state.ingredients) {
        state.ingredients = state.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
      }
    },
    // Перемещаем ингредиент в массиве
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;

      // Если индексы вне диапазона массива, не делаем ничего
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= (state.ingredients ? state.ingredients.length : 0) ||
        toIndex >= (state.ingredients ? state.ingredients.length : 0)
      ) {
        return;
      }

      const [movedIngredient] = state.ingredients!.splice(fromIndex, 1); // Извлекаем ингредиент из старой позиции
      state.ingredients!.splice(toIndex, 0, movedIngredient); // Вставляем ингредиент в новую позицию
    },
    // Сбрасываем состояние конструктора
    resetConstructor(state) {
      state.bun = initialState.bun;
      state.ingredients = initialState.ingredients;
      state.orderRequest = false;
      state.orderModalData = null;
      state.loading = true;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(takeOrder.pending, (state) => {
        state.orderRequest = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(takeOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.loading = false;
        state.error = action.error.message || 'Ошибка при отправке заказа';
      })
      .addCase(takeOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.bun = null;
        state.ingredients = [];
        state.loading = false;
        state.error = null;
      });
  }
});

// Экспортируем экшены
export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor
} = constructorSlice.actions;

// Селекторы

export const selectBun = (state: RootState) => state.burgerconstructor.bun;
export const selectIngredients = (state: RootState) =>
  state.burgerconstructor.ingredients;
export const selectOrderRequest = (state: RootState) =>
  state.burgerconstructor.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.burgerconstructor.orderModalData;
export const selectLoading = (state: RootState) =>
  state.burgerconstructor.loading;
export const selectError = (state: RootState) => state.burgerconstructor.error;
export const selectConstructorItems = createSelector(
  [selectBun, selectIngredients],
  (bun, ingredients) => ({
    bun,
    ingredients
  })
);

// Экспортируем редюсер
export default constructorSlice.reducer;
