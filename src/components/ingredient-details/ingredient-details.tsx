import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import {
  fetchIngredients,
  selectIngredients,
  selectLoading,
  selectError
} from '../../services/slices/ingredients/ingredientsSlice';
import { AppDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Получаем данные ингредиентов и состояние загрузки из Redux
  const ingredients = useSelector(selectIngredients);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  // Получаем id ингредиента из URL параметров
  const { id } = useParams<{ id: string }>();

  // Эффект для загрузки ингредиентов при монтировании компонента
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  // Обработка состояния загрузки
  if (loading) {
    return <Preloader />;
  }
  // Обработка ошибок
  if (error) {
    return <div>{error}</div>; // Можно заменить на ваш компонент для отображения ошибок
  }
  // Найти ингредиент по id из URL
  const ingredientData = ingredients.find((item) => item._id === id); //в переменной вернули ингредиент, id которого совпадает с id params url

  // Если ингредиент не найден, можно вывести сообщение
  if (!ingredientData) {
    return <div>Ингредиент не найден</div>;
  }
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
