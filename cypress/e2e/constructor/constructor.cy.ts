///<reference types="cypress"/>

describe('Constructor page test', function () {
  // Константы для селекторов (в стиле camelCase с префиксом selector в конце)
  const bunElementSelector = '[data-cy=ingredients_bun]';
  const topBunSelector = '[data-cy=top_bun_constructor]';
  const bottomBunSelector = '[data-cy=bottom_bun_constructor]';
  const ingredientListSelector = '[data-cy=ingredient_list_constructor]';
  const mainIngredientSelector = '[data-cy=ingredients_main]';
  const sauceIngredientSelector = '[data-cy=ingredients_sauce]';
  //const ingredientPlaceholderSelector = '[data-cy=ingredient_placeholder]';

  // Настройка перед каждым тестом
  beforeEach(function () {
    // Мокаем запрос на получение ингредиентов
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'  // Использование файла с фикстурами
    }).as('getIngredients');
    
    // Переходим на страницу
    cy.visit('/');
    
    // Ожидаем, что запрос на получение ингредиентов завершится
    cy.wait('@getIngredients');
  });

  // Тест добавления булки в конструктор при клике на кнопку
  it('Test of adding bun', function () {
    // Проверяем, что булочки отсутствуют перед нажатием 'Добавить'
    cy.get(topBunSelector).should('not.exist');
    cy.get(bottomBunSelector).should('not.exist');

    // Добавляем булочку, нажимая 'Добавить'
    cy.get(bunElementSelector).contains('Добавить').click();

    // Проверяем, что булочки присутствуют после нажатия 'Добавить'
    cy.get(topBunSelector).should('exist');
    cy.get(bottomBunSelector).should('exist');
  });

  // Тест добавления ингредиентов в конструктор при клике на кнопку
  it('Test of adding main ingredients and sauces', function () {
    // Проверяем, что начинки отсутствуют перед нажатием 'Добавить'
    cy.get(ingredientListSelector).contains('Куриное филе').should('not.exist');
    cy.get(ingredientListSelector).contains('Говядина').should('not.exist');

    // Добавляем начинки, нажимая 'Добавить'
    cy.get(mainIngredientSelector).contains('Добавить').click();

    // Проверяем, что начинки присутствуют после нажатия 'Добавить'
    cy.get(ingredientListSelector).contains('Куриное филе').should('exist');

    // Добавляем соус, нажимая 'Добавить'
    cy.get(sauceIngredientSelector).contains('Добавить').click();

    // Проверяем, что соус присутствует после нажатия 'Добавить'
    cy.get(ingredientListSelector).contains('Чесночный соус').should('exist');
  });
});
