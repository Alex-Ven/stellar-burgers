///<reference types="cypress"/>

describe('Modal window test', function () {
  // Настройка перед каждым тестом
  beforeEach(function() {
    // Мокаем запрос на получение ингредиентов
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'  // Использование файла с фикстурами
    }).as('getIngredients');
    
    // Переходим на страницу
    cy.visit('http://localhost:4000/');
    
    // Ожидаем, что запрос на получение ингредиентов завершится
    cy.wait('@getIngredients');
  });

  //открытие модального окна при клике на ингредиент в списке 
  it('Ingredient modal window is opened', function () {
      cy.get('[data-cy=modal-window]').should('not.exist');
      cy.get('[data-cy=ingredients_bun]').contains('Булка с кунжутом').click();
      cy.get('[data-cy=modal-window]').contains('Булка с кунжутом').should('exist');
  })

  //закрытие модального окна при клике на крестик
  it('Ingredient modal window is closed by close btn', function() {
      cy.get('[data-cy=ingredients_bun]').contains('Булка с кунжутом').click();
      cy.get('[data-cy=modal-close-btn]').click();
      cy.get('[data-cy=modal-window]').should('not.exist');
  })

  //закрытие модального окна при клике на оверлей
  it('Ingredient modal window is closed by overlay click', function () {
      cy.get('[data-cy=ingredients_bun]').contains('Булка с кунжутом').click();
      cy.get('[data-cy=modal-window]').should('exist');
      cy.get('[data-cy=modal-overlay]').should('exist').click('topRight', {force : true});
      cy.get('[data-cy=modal-window]').should('not.exist');
  })
})
