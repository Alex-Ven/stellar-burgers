///<reference types="cypress"/>

// Проверка создания заказа
describe('Order test', function () {
  beforeEach(function () {
    // Симуляция запросов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' });
    
    // Токены для успешной авторизации
    window.localStorage.setItem('refreshToken', JSON.stringify('test-refreshToken'));
    cy.setCookie('accessToken', 'test-accessToken');

    // Переход на страницу
    cy.visit('http://localhost:4000');
    
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
    cy.get('[data-cy=ingredients_bun]').contains('Добавить').click();
    cy.get('[data-cy=ingredients_main]').contains('Добавить').click();
    cy.get('[data-cy=ingredients_sauce]').contains('Добавить').click();

    // Клик на кнопку оформления заказа
    cy.get('[data-cy=order_button]')
      .contains('Оформить заказ')
      .should('exist')
      .click();

    // Проверка номера заказа в модальном окне
    cy.get('[data-cy=order_number]').should('contain.text', '2257890'); // Используем номер из ответа API

    // Проверка закрытия модального окна при клике на крестик
    cy.get('[data-cy=modal-close-btn]').click();
    cy.get('[data-cy=modal-window]').should('not.exist');

    // Проверка очищения конструктора от ингредиентов
    cy.get('[data-cy=burger_constructor]').should('not.contain', 'Булка с кунжутом');
    cy.get('[data-cy=ingredient_list_constructor]').should('not.contain', 'Чесночный соус');
    cy.get('[data-cy=ingredient_list_constructor]').should('not.contain', 'Куриное филе');
  });
});
