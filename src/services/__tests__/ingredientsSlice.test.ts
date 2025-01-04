import ingredientsReducer, {
  fetchIngredients
} from '../slices/ingredients/ingredientsSlice';
import { TIngredient } from '@utils-types'; // Импортируем тип TIngredient

// Объявление переменных с ингредиентами
const bunIngredient: TIngredient = {
  _id: '1',
  name: 'Пшеничная булка с кунжутом',
  type: 'bun',
  proteins: 75,
  fat: 20,
  carbohydrates: 50,
  calories: 400,
  price: 1050,
  image: 'image_url',
  image_large: 'image_large_url',
  image_mobile: 'image_mobile_url'
};

const sauceIngredient: TIngredient = {
  _id: '2',
  name: 'Соус Острая Чили',
  type: 'sauce',
  proteins: 3,
  fat: 1,
  carbohydrates: 8,
  calories: 30,
  price: 45,
  image: 'image_url',
  image_large: 'image_large_url',
  image_mobile: 'image_mobile_url'
};

const vegetableIngredient: TIngredient = {
  _id: '3',
  name: 'Листья салата Айсберг',
  type: 'vegetable',
  proteins: 1,
  fat: 0.2,
  carbohydrates: 3,
  calories: 15,
  price: 20,
  image: 'image_url',
  image_large: 'image_large_url',
  image_mobile: 'image_mobile_url'
};

// Инициализация состояния
const initialState = {
  items: [],
  loading: false,
  error: null
};

describe('Ingredients slice tests', () => {
  // Тестирование экшена `pending`
  it('should set loading to true and error to null when fetchIngredients is pending', () => {
    const actualState = ingredientsReducer(
      { ...initialState, error: 'Test error' }, // Изначально ошибка в состоянии
      fetchIngredients.pending('some-request-id', undefined) // Эмулируем выполнение экшена pending
    );

    // Проверяем, что состояние обновляется: loading = true, error сброшено
    expect(actualState).toEqual({
      items: [],
      loading: true,
      error: null
    });
  });

  // Тестирование экшена `fulfilled`
  it('should set loading to false and update items when fetchIngredients is fulfilled', () => {
    const mockIngredients: TIngredient[] = [
      bunIngredient,
      sauceIngredient,
      vegetableIngredient
    ];

    const actualState = ingredientsReducer(
      { ...initialState, loading: true }, // Изначально загрузка в процессе
      fetchIngredients.fulfilled(mockIngredients, 'some-request-id') // Эмулируем успешный ответ
    );

    // Проверяем, что состояние обновляется: loading = false, items обновлены
    expect(actualState).toEqual({
      items: mockIngredients,
      loading: false,
      error: null
    });
  });

  // Тестирование экшена `rejected`
  it('should set loading to false and set error when fetchIngredients is rejected', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';

    const actualState = ingredientsReducer(
      { ...initialState, loading: true }, // Изначально загрузка в процессе
      fetchIngredients.rejected(new Error(errorMessage), 'some-request-id') // Эмулируем неуспешный ответ
    );

    // Проверяем, что состояние обновляется: loading = false, ошибка установлена
    expect(actualState).toEqual({
      items: [],
      loading: false,
      error: errorMessage
    });
  });
});
