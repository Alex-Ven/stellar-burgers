import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  getOrdersApi,
  TLoginData,
  TRegisterData
} from '../../../utils/burger-api';
import { TUser, TOrder } from '@utils-types';
import { RootState } from 'src/services/store';
import { setCookie, getCookie, deleteCookie } from '../../../utils/cookie';

// Типы состояния
interface UserState {
  isAuthChecked: boolean; // флаг проверки аутентификации
  isAuthenticated: boolean; // флаг авторизации
  user: TUser | null; // данные пользователя
  orders: TOrder[]; // заказы пользователя
  isLoading: boolean; // флаг загрузки
  error: string | null; // сообщение об ошибке
  loginUserRequest: boolean; // флаг запроса на вход
  ordersLoading: boolean; // флаг загрузки истории заказов
  ordersError: string | null; // ошибка при загрузке заказов
}

// Начальное состояние
const initialState: UserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  orders: [],
  isLoading: false,
  error: null,
  loginUserRequest: false,
  ordersLoading: false,
  ordersError: null
};

// Асинхронные Thunk-функции

// Авторизация пользователя
export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: { message: string } }
>('user/loginUser', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);

    // Сохраняем токены
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    // Проверяем наличие refreshToken
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      console.log('Refresh token saved:', refreshToken);
    } else {
      console.error('Refresh token not found after login');
    }

    return response.user;
  } catch (error) {
    return rejectWithValue({
      message: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
});

// Получение данных пользователя
export const getUserData = createAsyncThunk('user/getUserData', getUserApi);

// Регистрация пользователя
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

// Обновление данных пользователя
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    return response.user;
  }
);

// Выход пользователя
export const userLogout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Сброс пароля
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => {
    const response = await forgotPasswordApi(data);
    return response; // Возвращаем ответ от API
  }
);

// Установка нового пароля
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => {
    const response = await resetPasswordApi(data);
    return response; // Возвращаем ответ от API
  }
);

// Получение заказов пользователя (история заказов)
export const fetchOrders = createAsyncThunk('user/fetchOrders', async () => {
  const orders = await getOrdersApi();
  return orders; // Возвращаем массив заказов
});

// Слайс
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Проверка аутентификации пользователя
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthenticated = false;
        state.isLoading = true;
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при проверке аутентификации';
      })

      // Авторизация пользователя
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.loginUserRequest = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка входа';
        state.loginUserRequest = false;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })

      // Получение данных пользователя
      .addCase(getUserData.pending, (state) => {
        state.isAuthenticated = false;
        state.loginUserRequest = true;
        state.isLoading = true;
        state.error = null;
        state.user = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.loginUserRequest = false;
        state.isLoading = false;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isAuthChecked = true;
        state.loginUserRequest = false;
        state.error = action.error.message || 'Ошибка получения данных';
      })

      // Регистрация пользователя
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })

      // Обновление данных пользователя
      .addCase(updateUser.pending, (state) => {
        state.loginUserRequest = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload }; // Обновляем только измененные поля
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления данных';
      })

      // Выход пользователя
      .addCase(userLogout.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.loginUserRequest = false;
        state.user = null;
        state.orders = [];
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loginUserRequest = false;
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка выхода';
      })

      // Сброс пароля
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка сброса пароля';
      })

      // Установка нового пароля
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка установки нового пароля';
      })

      // Получение заказов
      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload;
        state.ordersError = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.error.message || 'Ошибка получения заказов';
      });
  }
});

// Проверка аутентификации пользователя (проверка наличия токена)
export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    const token = getCookie('accessToken');
    if (token) {
      await dispatch(getUserData()); // Получаем данные пользователя
      dispatch(authChecked()); // После этого устанавливаем флаг о завершении проверки
    } else {
      dispatch(authChecked()); // Токен не найден, сразу завершаем проверку
    }
  }
);

// Экспортируем редьюсер и экшены
export const { authChecked } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuth = (state: RootState) => state.user.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectError = (state: RootState) => state.user.error;
export const selectUserOrders = (state: RootState) => state.user.orders;
export const selectOrdersLoading = (state: RootState) =>
  state.user.ordersLoading;
export const selectOrdersError = (state: RootState) => state.user.ordersError;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;

export default userSlice.reducer;
