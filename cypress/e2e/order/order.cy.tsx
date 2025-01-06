///<reference types="cypress"/>

// Проверка создания заказа
describe('Order test', function () {
  // Константы для селекторов (в стиле camelCase с префиксом selector в конце)
  const bunElementSelector = '[data-cy=ingredients_bun]';
  const mainIngredientSelector = '[data-cy=ingredients_main]';
  const sauceIngredientSelector = '[data-cy=ingredients_sauce]';
  const orderButtonSelector = '[data-cy=order_button]';
  const modalWindowSelector = '[data-cy=modal-window]';
  //const orderNumberSelector = '[data-cy=order_number]';
  const modalCloseBtnSelector = '[data-cy=modal-close-btn]';
  const burgerConstructorSelector = '[data-cy=burger_constructor]';
  const ingredientListConstructorSelector = '[data-cy=ingredient_list_constructor]';

  beforeEach(function () {
    // Симуляция запросов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '/api/orders', (req) => {
      
      req.reply({ fixture: 'order.json' });
    }).as('postOrder');


    // Токены для успешной авторизации
    window.localStorage.setItem('refreshToken', JSON.stringify('test-refreshToken'));
    cy.setCookie('accessToken', 'test-accessToken');

    // Переход на страницу
    cy.visit('/');
    
    // Ожидание завершения запроса ингредиентов
    cy.wait('@getIngredients');
  });

  afterEach(function () {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  // Добавление ингредиентов и создание заказа
  it('Create success order test', function () {
    // Добавление ингредиентов
    cy.get(bunElementSelector).contains('Добавить').click();
    cy.get(mainIngredientSelector).contains('Добавить').click();
    cy.get(sauceIngredientSelector).contains('Добавить').click();

    // Клик на кнопку оформления заказа
    cy.get(orderButtonSelector)
      .contains('Оформить заказ')
      .should('exist')
      .click();

    // Ожидание завершения запроса на создание заказа
    cy.wait('@postOrder').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(String(interception.response?.body.order.number)).to.eq('2257890');
    });


    // Проверка закрытия модального окна при клике на крестик
    cy.get(modalCloseBtnSelector).click();
    cy.get(modalWindowSelector).should('not.exist');

    // Проверка очищения конструктора от ингредиентов
    cy.get(burgerConstructorSelector).should('not.contain', 'Булка с кунжутом');
    cy.get(ingredientListConstructorSelector).should('not.contain', 'Чесночный соус');
    cy.get(ingredientListConstructorSelector).should('not.contain', 'Куриное филе');
  });
});