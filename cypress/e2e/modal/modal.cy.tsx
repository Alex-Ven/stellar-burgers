/// <reference types="cypress" />

describe('Тест модального окна', function () {
  // Константы для селекторов
  const modalWindowSelector = '[data-cy=modal-window]';
  const modalCloseBtnSelector = '[data-cy=modal-close-btn]';
  const modalOverlaySelector = '[data-cy=modal-overlay]';
  const ingredientsBunSelector = '[data-cy=ingredients_bun]';

  // Настройка перед каждым тестом
  beforeEach(function () {
    // Мокинг запроса для получения ингредиентов
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json',
    }).as('getIngredients');

    // Переход на страницу
    cy.visit('/');

    // Ожидание завершения запроса ингредиентов
    cy.wait('@getIngredients');
  });

  // Открытие модального окна кликом по ингредиенту в списке
  it('Модальное окно ингредиента открывается', function () {
    cy.get(ingredientsBunSelector).contains('Булка с кунжутом').as('bunElement');
    cy.get('@bunElement').click();
    cy.get(modalWindowSelector).contains('Булка с кунжутом').should('exist');
  });

  // Закрытие модального окна кликом по кнопке закрытия
  it('Модальное окно ингредиента закрывается кнопкой закрытия', function () {
    cy.get(ingredientsBunSelector).contains('Булка с кунжутом').as('bunElement');
    cy.get('@bunElement').click();
    cy.get(modalCloseBtnSelector).as('closeButton');
    cy.get('@closeButton').click();
    cy.get(modalWindowSelector).should('not.exist');
  });

  // Закрытие модального окна кликом по оверлею
  it('Модальное окно ингредиента закрывается кликом по оверлею', function () {
    cy.get(ingredientsBunSelector).contains('Булка с кунжутом').as('bunElement');
    cy.get('@bunElement').click();
    cy.get(modalOverlaySelector).as('modalOverlay');
    cy.get('@modalOverlay').click('topRight', {force : true}); // Простого клика должно быть достаточно, force и topRight не нужны
    cy.get(modalWindowSelector).should('not.exist');
  });
});