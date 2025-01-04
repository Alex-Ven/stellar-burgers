describe('Constructor page test', function () {
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

  // Тест добавления булки в конструктор при клике на кнопку
  it('Test of adding bun', function () {
    // Проверяем, что булочки отсутствуют перед нажатием 'Добавить'
    cy.get('[data-cy=top_bun_constructor]').should('not.exist');
    cy.get('[data-cy=bottom_bun_constructor]').should('not.exist');

    // Добавляем булочку, нажимая 'Добавить'
    cy.get('[data-cy=ingredients_bun]').contains('Добавить').click();

    // Проверяем, что булочки присутствуют после нажатия 'Добавить'
    cy.get('[data-cy=top_bun_constructor]').should('exist');
    cy.get('[data-cy=bottom_bun_constructor]').should('exist');
  });

  // Тест добавления ингредиентов в конструктор при клике на кнопку
  it('Test of adding main ingredients and sauces', function () {
    // Проверяем, что начинки отсутствуют перед нажатием 'Добавить'
    cy.get('[data-cy=ingredient_list_constructor]').contains('Куриное филе').should('not.exist');
    cy.get('[data-cy=ingredient_list_constructor]').contains('Говядина').should('not.exist');

    // Добавляем начинки, нажимая 'Добавить'
    cy.get('[data-cy=ingredients_main]').contains('Добавить').click();

    // Проверяем, что начинки присутствуют после нажатия 'Добавить'
    cy.get('[data-cy=ingredient_list_constructor]').contains('Куриное филе').should('exist');

    // Добавляем соус, нажимая 'Добавить'
    cy.get('[data-cy=ingredients_sauce]').contains('Добавить').click();

    // Проверяем, что соус присутствует после нажатия 'Добавить'
    cy.get('[data-cy=ingredient_list_constructor]').contains('Чесночный соус').should('exist');
  });
});
