import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from 'react-redux';

import { selectConstructorItems } from '../../services/slices/burger/burgerSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients, ...rest }, ref) => {
  // Получаем данные конструктора
  const { bun, ingredients: constructorIngredients } = useSelector(
    selectConstructorItems
  );

  // Собираем все данные конструктора в один объект
  const constructorItems = {
    bun: bun,
    ingredients: constructorIngredients || [] // Убедимся, что ingredients всегда массив
  };

  const ingredientsCounters = useMemo<{ [key: string]: number }>(() => {
    const { bun, ingredients } = constructorItems;
    const counters: { [key: string]: number } = {};
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [constructorItems]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
      {...rest}
      //data-cy={`ingredients-category-${title.toLowerCase()}`}
    />
  );
});
