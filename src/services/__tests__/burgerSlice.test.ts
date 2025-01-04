import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../slices/burger/burgerSlice';
import { TConstructorIngredient } from '@utils-types';

// Объявление переменных ингредиентов
const tomatoSauce: TConstructorIngredient = {
  _id: '1',
  type: 'sauce',
  name: 'Tomato Sauce',
  price: 50,
  image: 'image_url',
  image_large: 'image_large_url',
  image_mobile: 'image_mobile_url',
  id: '1_1234567890',
  proteins: 2,
  fat: 1,
  carbohydrates: 5,
  calories: 40
};

const lettuce: TConstructorIngredient = {
  _id: '2',
  type: 'vegetable',
  name: 'Lettuce',
  price: 30,
  image: 'lettuce_image_url',
  image_large: 'lettuce_image_large_url',
  image_mobile: 'lettuce_image_mobile_url',
  id: '2_1234567890',
  proteins: 1,
  fat: 0,
  carbohydrates: 4,
  calories: 15
};

const burgerBun: TConstructorIngredient = {
  _id: '2',
  type: 'bun',
  name: 'Sesame Bun',
  price: 100,
  image: 'bun_image_url',
  image_large: 'bun_image_large_url',
  image_mobile: 'bun_image_mobile_url',
  id: '2_1234567890',
  proteins: 10,
  fat: 5,
  carbohydrates: 30,
  calories: 250
};

const sauceIngredient: TConstructorIngredient = {
  _id: '1',
  type: 'sauce',
  name: 'Tomato Sauce',
  price: 50,
  image: 'image_url',
  image_large: 'image_large_url',
  image_mobile: 'image_mobile_url',
  id: '1_1234567890',
  proteins: 2,
  fat: 1,
  carbohydrates: 5,
  calories: 40
};

describe('burgerSlice test', () => {
  let initialState: {
    bun: null | TConstructorIngredient;
    ingredients: TConstructorIngredient[];
    orderRequest: boolean;
    orderModalData: null | any;
    loading: boolean;
    error: null | string;
  };

  beforeEach(() => {
    initialState = {
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null,
      loading: true,
      error: null
    };
  });

  jest.spyOn(Date, 'now').mockReturnValue(1234567890); // Мокаем Date.now() для получения фиксированного значения

  it('should add an ingredient to the constructor', () => {
    const state = reducer(initialState, addIngredient(sauceIngredient)); // Используем импортированный редуктор

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(sauceIngredient);
  });

  it('should replace the bun when a bun ingredient is added', () => {
    const state = reducer(initialState, addIngredient(burgerBun)); // Используем импортированный редуктор

    expect(state.bun).toEqual(burgerBun);
    expect(state.ingredients).toHaveLength(0);
  });

  it('should remove an ingredient by ID', () => {
    // Инициализация состояния с двумя ингредиентами
    let state = reducer(initialState, addIngredient(sauceIngredient));
    state = reducer(state, addIngredient(lettuce));

    // Удаление первого ингредиента
    state = reducer(state, removeIngredient('1_1234567890'));

    expect(state.ingredients).toHaveLength(1); // После удаления остается 1 ингредиент
    expect(state.ingredients[0].id).toEqual('2_1234567890'); // Ожидаем, что остался только второй ингредиент
  });

  it('should move an ingredient in the list', () => {
    // Инициализация состояния с двумя ингредиентами
    let state = reducer(initialState, addIngredient(sauceIngredient));
    state = reducer(state, addIngredient(lettuce));

    // Перемещение ингредиента из позиции 0 в позицию 1
    state = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 1 }));

    expect(state.ingredients[0]).toEqual(lettuce); // Ожидаем, что первым будет Lettuce
    expect(state.ingredients[1]).toEqual(sauceIngredient); // Ожидаем, что вторым будет Tomato Sauce
  });

  it('should not move ingredient if indexes are out of bounds', () => {
    let state = reducer(initialState, addIngredient(sauceIngredient));

    // Попытка перемещения с неправильными индексами
    state = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 2 }));

    // Ингредиент не должен переместиться, так как индекс 2 не существует
    expect(state.ingredients[0]).toEqual(sauceIngredient);
  });
});
