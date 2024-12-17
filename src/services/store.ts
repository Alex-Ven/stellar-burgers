import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userReducer from './slices/user/userSlice'; // Путь к редьюсеру пользователя
import constructorReducer from './slices/burger/burgerSlice';
import feedReducer from './slices/feed/feedSlice';
import ingredientsReducer from './slices/ingredients/ingredientsSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  burgerconstructor: constructorReducer, // Добавляем редьюсер конструктора
  feed: feedReducer, // Добавляем редьюсер данных
  user: userReducer, // Добавляем редьюсер пользователя
  ingredients: ingredientsReducer // Добавляем редьюсер ингредиентов
});
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
