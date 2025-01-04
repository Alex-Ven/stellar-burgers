import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import {
  selectIngredients,
  selectLoading
} from '../../services/slices/ingredients/ingredientsSlice';

import { useSelector } from 'react-redux';
import { Preloader } from '@ui';

export const BurgerIngredients: FC = () => {
  // Получаем ингредиенты и состояние загрузки.
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectLoading);
  if (isLoading) {
    return <Preloader />;
  }

  // Ингредиенты фильтруются по типу, что позволяет разбить их на булки, начинки и соусы.
  // Используем useMemo для мемоизации отфильтрованных массивов (buns, mains, sauces), чтобы избежать повторной фильтрации при каждом рендере.

  const buns = useMemo(
    () => ingredients.filter((item) => item.type === 'bun'),
    [ingredients]
  );
  const mains = useMemo(
    () => ingredients.filter((item) => item.type === 'main'),
    [ingredients]
  );
  const sauces = useMemo(
    () => ingredients.filter((item) => item.type === 'sauce'),
    [ingredients]
  );

  // Ссылки на заголовки секций создаются с помощью useRef, а видимость секций отслеживается с помощью useInView.
  //Это позволяет устанавливать активную вкладку в зависимости от видимости секции.
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Функция onTabClick изменяет текущую вкладку и прокручивает к соответствующей секции.
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    console.log('BurgerIngredients отрендерен');
  }, []);

  // Компонент возвращает BurgerIngredientsUI, передавая все необходимые данные и функции.
  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
