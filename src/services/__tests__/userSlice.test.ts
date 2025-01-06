import reducer, {
  loginUser,
  registerUser,
  updateUser,
  userLogout,
  fetchOrders,
  forgotPassword,
  resetPassword,
  checkUserAuth,
  authChecked,
  initialState // Импортируем initialState из редьюсера
} from '../slices/user/userSlice';

const testUser = {
  success: true,
  user: {
    email: 'test.email@yandex.ru',
    name: 'test'
  },
  accessToken: 'testAccessToken', // Мокированный токен доступа
  refreshToken: 'testRefreshToken' // Мокированный токен обновления
};

const testLogIn = {
  email: 'test.email@yandex.ru',
  password: 'password' // Мокированные данные для входа
};

const testRegisterUser = {
  email: 'test.email@yandex.ru',
  name: 'test',
  password: 'password' // Мокированные данные для регистрации
};

const updatedUser = {
  success: true,
  user: {
    email: 'test.email@yandex.ru',
    name: 'test001' // Обновленные данные пользователя
  }
};

// Данные для заказов
const orders = [
  {
    _id: '1',
    ingredients: ['Курица', 'Картофель', 'Салат'],
    status: 'Готово',
    name: 'Заказ №1',
    createdAt: '2025-01-02',
    updatedAt: '2025-01-02',
    number: 1021
  },
  {
    _id: '2',
    ingredients: ['Говядина', 'Бекон', 'Лук', 'Соус'],
    status: 'В процессе',
    name: 'Заказ №2',
    createdAt: '2025-01-03',
    updatedAt: '2025-01-03',
    number: 1022
  }
];

// Тесты
describe('userSlice', () => {
  it('should handle authChecked', () => {
    const actualState = reducer(initialState, authChecked());
    expect(actualState.isAuthChecked).toBe(true); // Проверка, что флаг аутентификации установлен в true
  });

  it('should handle checkUserAuth into pending status', () => {
    const actualState = reducer(
      initialState,
      checkUserAuth.pending('', undefined)
    );
    expect(actualState.isLoading).toBe(true); // При запросе авторизации флаг загрузки должен быть true
    expect(actualState.isAuthenticated).toBe(false); // Статус авторизации не должен измениться
  });

  it('should handle checkUserAuth into fulfilled status', () => {
    const actualState = reducer(
      initialState,
      checkUserAuth.fulfilled(undefined, '', undefined)
    );
    expect(actualState.isAuthChecked).toBe(true); // Проверка завершена, флаг должен быть true
    expect(actualState.isAuthenticated).toBe(true); // Пользователь не авторизован без токенов
  });

  it('should handle checkUserAuth into rejected status', () => {
    const error = new Error('Ошибка при проверке аутентификации');
    const actualState = reducer(
      initialState,
      checkUserAuth.rejected(error, '', undefined)
    );
    expect(actualState.error).toBe('Ошибка при проверке аутентификации'); // Сообщение об ошибке
    expect(actualState.isAuthChecked).toBe(true); // Проверка завершена
  });

  it('should handle loginUser into pending status', () => {
    const actualState = reducer(initialState, loginUser.pending('', testLogIn));
    expect(actualState.loginUserRequest).toBe(true); // Запрос входа в процессе
    expect(actualState.error).toBeNull(); // Ошибки пока нет
  });

  it('should handle loginUser into fulfilled status', () => {
    const actualState = reducer(
      initialState,
      loginUser.fulfilled(testUser.user, '', testLogIn)
    );
    expect(actualState.isAuthenticated).toBe(true); // После успешного входа пользователь авторизован
    expect(actualState.user).toEqual(testUser.user); // Пользовательские данные сохранены
    expect(actualState.isAuthChecked).toBe(true); // Проверка аутентификации завершена
    expect(actualState.loginUserRequest).toBe(false); // Запрос завершен
  });

  it('should handle loginUser into rejected status', () => {
    const error = new Error('Ошибка входа');
    const actualState = reducer(
      initialState,
      loginUser.rejected(error, '', testLogIn)
    );
    expect(actualState.isAuthenticated).toBe(false); // Пользователь не авторизован
    expect(actualState.loginUserRequest).toBe(false); // Запрос завершен
    expect(actualState.isAuthChecked).toBe(true); // Проверка завершена
    expect(actualState.error).toBe('Ошибка входа'); // Сообщение об ошибке
  });

  it('should handle registerUser into pending status', () => {
    const actualState = reducer(
      initialState,
      registerUser.pending('', testRegisterUser)
    );
    expect(actualState.isLoading).toBe(true); // При регистрации статус загрузки должен быть true
    expect(actualState.isAuthenticated).toBe(false); // Пользователь не авторизован
  });

  it('should handle registerUser into fulfilled status', () => {
    const actualState = reducer(
      initialState,
      registerUser.fulfilled(testUser.user, '', testRegisterUser)
    );
    expect(actualState.isLoading).toBe(false); // После регистрации статус загрузки должен быть false
    expect(actualState.isAuthenticated).toBe(true); // Пользователь авторизован
    expect(actualState.user).toEqual(testUser.user); // Данные пользователя обновлены
  });

  it('should handle registerUser into rejected status', () => {
    const error = new Error('Registration failed');
    const actualState = reducer(
      initialState,
      registerUser.rejected(error, '', testRegisterUser)
    );
    expect(actualState.isLoading).toBe(false); // Статус загрузки должен быть false после ошибки
    expect(actualState.isAuthenticated).toBe(false); // Пользователь не авторизован
    expect(actualState.error).toBe('Registration failed'); // Сообщение об ошибке
  });

  it('should handle updateUser into pending status', () => {
    const actualState = reducer(
      initialState,
      updateUser.pending('', updatedUser.user)
    );
    expect(actualState.isLoading).toBe(true); // При обновлении данных флаг загрузки должен быть true
    expect(actualState.loginUserRequest).toBe(true); // Флаг запроса входа должен быть активен
  });

  it('should handle updateUser into fulfilled status', () => {
    const actualState = reducer(
      initialState,
      updateUser.fulfilled(updatedUser.user, '', updatedUser.user)
    );
    expect(actualState.isLoading).toBe(false); // После успешного обновления флаг загрузки должен быть false
    expect(actualState.user).toEqual(updatedUser.user); // Данные пользователя обновлены
  });

  it('should handle updateUser into rejected status', () => {
    const error = new Error('Update failed');
    const actualState = reducer(
      initialState,
      updateUser.rejected(error, '', updatedUser.user)
    );
    expect(actualState.isLoading).toBe(false); // Статус загрузки завершен
    expect(actualState.error).toBe('Update failed'); // Сообщение об ошибке
  });

  it('should handle userLogout into pending status', () => {
    const actualState = reducer(
      initialState,
      userLogout.pending('', undefined)
    );
    expect(actualState.isLoading).toBe(true); // При выходе из системы статус загрузки должен быть true
    expect(actualState.isAuthenticated).toBe(false); // Пользователь не авторизован
  });

  it('should handle userLogout into fulfilled status', () => {
    const previousState = {
      ...initialState,
      isAuthenticated: true,
      user: testUser.user
    };
    const actualState = reducer(
      previousState,
      userLogout.fulfilled(undefined, '')
    );
    expect(actualState.isAuthenticated).toBe(false); // После выхода пользователь не авторизован
    expect(actualState.user).toBeNull(); // Данные пользователя очищены
  });

  it('should handle userLogout into rejected status', () => {
    const error = new Error('Logout failed');
    const previousState = {
      ...initialState,
      isAuthenticated: true,
      user: testUser.user
    };
    const actualState = reducer(previousState, userLogout.rejected(error, ''));
    expect(actualState.isAuthenticated).toBe(false); // После ошибки выхода пользователь не авторизован
    expect(actualState.error).toBe('Logout failed'); // Сообщение об ошибке
  });

  it('should handle fetchOrders into pending status', () => {
    const actualState = reducer(
      initialState,
      fetchOrders.pending('', undefined)
    );
    expect(actualState.ordersLoading).toBe(true); // При запросе заказов флаг загрузки должен быть true
    expect(actualState.ordersError).toBeNull(); // Ошибки пока нет
  });

  it('should handle fetchOrders into fulfilled status', () => {
    const actualState = reducer(
      initialState,
      fetchOrders.fulfilled(orders, '', undefined)
    );
    expect(actualState.ordersLoading).toBe(false); // Статус загрузки завершен
    expect(actualState.orders).toEqual(orders); // Заказы сохранены в состоянии
  });

  it('should handle fetchOrders into rejected status', () => {
    const error = new Error('Fetch Orders failed');
    const actualState = reducer(initialState, fetchOrders.rejected(error, ''));
    expect(actualState.ordersLoading).toBe(false); // Статус загрузки завершен
    expect(actualState.ordersError).toBe('Fetch Orders failed'); // Сообщение об ошибке
  });

  it('should handle forgotPassword into pending status', () => {
    const actualState = reducer(
      initialState,
      forgotPassword.pending('', { email: 'test@mail.com' })
    );
    expect(actualState.isLoading).toBe(true); // При запросе восстановления пароля статус загрузки true
    expect(actualState.error).toBeNull(); // Ошибки нет
  });

  it('should handle forgotPassword into fulfilled status', () => {
    const actualState = reducer(
      initialState,
      forgotPassword.fulfilled({ success: true }, '', {
        email: 'test@mail.com'
      })
    );
    expect(actualState.isLoading).toBe(false); // Статус загрузки завершен
  });

  it('should handle forgotPassword into rejected status', () => {
    const error = new Error('Ошибка сброса пароля');
    const actualState = reducer(
      initialState,
      forgotPassword.rejected(error, '', { email: 'test@mail.com' })
    );
    expect(actualState.isLoading).toBe(false); // Статус загрузки завершен
    expect(actualState.error).toBe('Ошибка сброса пароля'); // Сообщение об ошибке
  });

  it('should handle resetPassword into pending status', () => {
    const actualState = reducer(
      initialState,
      resetPassword.pending('', { password: 'newPassword', token: 'testToken' })
    );
    expect(actualState.isLoading).toBe(true); // При запросе восстановления пароля статус загрузки true
    expect(actualState.error).toBeNull(); // Ошибки нет
  });

  it('should handle resetPassword into fulfilled status', () => {
    const actualState = reducer(
      initialState,
      resetPassword.fulfilled({ success: true }, '', {
        password: 'newPassword',
        token: 'testToken'
      })
    );
    expect(actualState.isLoading).toBe(false); // Статус загрузки завершен
  });

  it('should handle resetPassword into rejected status', () => {
    const error = new Error('Ошибка установки нового пароля');
    const actualState = reducer(
      initialState,
      resetPassword.rejected(error, '', {
        password: 'newPassword',
        token: 'testToken'
      })
    );
    expect(actualState.isLoading).toBe(false); // Статус загрузки завершен
    expect(actualState.error).toBe('Ошибка установки нового пароля'); // Сообщение об ошибке
  });
});
