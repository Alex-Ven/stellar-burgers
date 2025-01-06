import reducer, {
  fetchFeedsData,
  fetchOrderByNumber,
  initialState
} from '../slices/feed/feedSlice';

// Тестовые данные заказов для использования в тестах
const testFeeds = {
  success: true,
  orders: [
    {
      _id: '1',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa093e'
      ],
      status: 'done',
      name: 'Чизбургер с беконом',
      createdAt: '2024-10-05T12:10:45.000Z',
      updatedAt: '2024-10-05T12:30:25.000Z',
      number: 1
    },
    {
      _id: '2',
      ingredients: [
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093f',
        '643d69a5c3f7b9001cfa0946',
        '643d69a5c3f7b9001cfa0949',
        '643d69a5c3f7b9001cfa0945',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Грильбургер с острым соусом',
      createdAt: '2024-10-05T08:15:55.000Z',
      updatedAt: '2024-10-05T08:45:15.000Z',
      number: 2
    },
    {
      _id: '3',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Классический бургер с картошкой',
      createdAt: '2024-10-05T09:20:10.000Z',
      updatedAt: '2024-10-05T09:40:00.000Z',
      number: 3
    }
  ],
  total: 3,
  totalToday: 3
};

describe('Feeds slice tests', () => {
  // Проверка на установку isLoading в true и сброс ошибки (error) при состоянии pending
  it('should set isLoading to true and error to null during pending status', () => {
    const actualState = reducer(
      {
        ...initialState,
        error: 'Ошибка получения заказов'
      },
      fetchFeedsData.pending('')
    );
    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      error: null,
      isLoading: true, // Ошибка сбрасывается
      selectedModalOrder: null // Загрузка начинается
    });
  });

  // Проверка на установку данных после успешной загрузки
  it('should set isLoading to false and update feed data after successful fetch', () => {
    const actualState = reducer(
      {
        ...initialState,
        isLoading: true
      },
      fetchFeedsData.fulfilled(testFeeds, '')
    );

    // Проверяем, что данные корректно сохраняются в состояние, а флаг isLoading сбрасывается.
    expect(actualState).toEqual({
      orders: testFeeds.orders,
      total: testFeeds.total,
      totalToday: testFeeds.totalToday,
      error: null,
      isLoading: false,
      selectedModalOrder: null
    });
  });

  // Проверка на установку ошибки (error) при отклонении загрузки данных
  it('should set error to error message and isLoading to false when fetch fails', () => {
    const testError = new Error('Ошибка получения заказов');
    const actualState = reducer(
      {
        ...initialState,
        isLoading: true
      },
      fetchFeedsData.rejected(testError, '')
    );

    // Проверяем, что ошибка корректно сохраняется в состояние, а флаг isLoading сбрасывается.
    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      selectedModalOrder: null,
      isLoading: false,
      error: 'Ошибка получения заказов'
    });
  });

  // Проверка на установку isLoading в true при запросе заказа по номеру (pending)
  it('should set isLoading to true when fetching order by number (pending)', () => {
    const actualState = reducer(
      {
        ...initialState,
        error: 'Ошибка получения заказов'
      },
      fetchOrderByNumber.pending('1', 1) // Аргументы (номер заказа и идентификатор запроса) не используются непосредственно в тесте
    );
    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      error: null,
      isLoading: true,
      selectedModalOrder: null
    });
  });

  // Проверка на установку заказа в selectedModalOrder и завершение загрузки (fulfilled)
  it('should set isLoading to false and update selectedModalOrder when fetchOrderByNumber is fulfilled', () => {
    const actualState = reducer(
      {
        ...initialState,
        isLoading: true
      },
      fetchOrderByNumber.fulfilled(testFeeds, '1', 1)
    );

    // Проверяем, что selectedModalOrder обновился, а isLoading завершена
    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      error: null,
      isLoading: false,
      selectedModalOrder: testFeeds.orders[0]
    });
  });

  // Проверка на установку ошибки и завершение загрузки при отказе в получении заказа (rejected)
  it('should set isLoading to false and error when fetchOrderByNumber is rejected', () => {
    const testError = new Error('Ошибка получения заказов');
    const actualState = reducer(
      {
        ...initialState,
        isLoading: true
      },
      fetchOrderByNumber.rejected(testError, '1', 1)
    );
    // Проверяем, что ошибка сохраняется, а флаг isLoading сбрасывается.
    expect(actualState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      selectedModalOrder: null,
      isLoading: false,
      error: 'Ошибка получения заказов'
    });
  });
});
