import { rootReducer } from '../store';
import { RootState } from '../store';

describe('rootReducer test', () => {
  test('init state test', () => {
    // Создаём тестовый экшен, который не будет обработан редьюсерами
    const testAction = { type: 'UNKNOWN_ACTION' };

    // Вызовем rootReducer с undefined как начальное состояние
    // Это должно вернуть начальное состояние, как определено в редьюсерах
    const initialState: RootState = rootReducer(undefined, testAction);

    // Проверяем, что начальное состояние редьюсера совпадает с ожидаемым состоянием
    expect(initialState).toEqual({
      burgerconstructor: {
        bun: null,
        ingredients: [],
        error: null,
        loading: true, // добавлено новое состояние
        orderModalData: null,
        orderRequest: false
      },
      feed: {
        orders: [],
        error: null,
        isLoading: false, // поправили на isLoading
        selectedModalOrder: null,
        total: 0,
        totalToday: 0
      },
      ingredients: {
        items: [],
        error: null,
        loading: false
      },
      user: {
        error: null,
        isAuthChecked: false,
        isAuthenticated: false,
        isLoading: false,
        loginUserRequest: false,
        orders: [],
        ordersError: null,
        ordersLoading: false,
        user: null
      }
    });
  });
});
