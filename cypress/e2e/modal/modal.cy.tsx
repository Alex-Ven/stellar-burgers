///<reference types="cypress"/>

describe('Modal window test', function () {
  // Константы для селекторов
  const modalWindowSelector = '[data-cy=modal-window]';
  const modalCloseBtnSelector = '[data-cy=modal-close-btn]';
  const modalOverlaySelector = '[data-cy=modal-overlay]';
  const ingredientsBunSelector = '[data-cy=ingredients_bun]';
  
  // Настройка перед каждым тестом
  beforeEach(function() {
    // Мокаем запрос на получение ингредиентов
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'  // Использование файла с фикстурами
    }).as('getIngredients');
    
    // Переходим на страницу
    cy.visit('/');
    
    // Ожидаем, что запрос на получение ингредиентов завершится
    cy.wait('@getIngredients');
  });

  // Открытие модального окна при клике на ингредиент в списке 
  it('Ingredient modal window is opened', function () {
      cy.get(modalWindowSelector).should('not.exist');
      cy.get(ingredientsBunSelector).contains('Булка с кунжутом').click();
      cy.get(modalWindowSelector).contains('Булка с кунжутом').should('exist');
  })

  // Закрытие модального окна при клике на крестик
  it('Ingredient modal window is closed by close btn', function() {
      cy.get(ingredientsBunSelector).contains('Булка с кунжутом').click();
      cy.get(modalCloseBtnSelector).click();
      cy.get(modalWindowSelector).should('not.exist');
  })

  // Закрытие модального окна при клике на оверлей
  it('Ingredient modal window is closed by overlay click', function () {
      cy.get(ingredientsBunSelector).contains('Булка с кунжутом').click();
      cy.get(modalWindowSelector).should('exist');
      cy.get(modalOverlaySelector).should('exist').click('topRight', {force : true});
      cy.get(modalWindowSelector).should('not.exist');
  })
})
