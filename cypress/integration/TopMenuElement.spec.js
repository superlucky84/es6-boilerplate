describe('상단 메뉴 - 요소', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('.menuBtn').click();

    cy.get('.ti-section-button').click();
    cy.get('.ti-add-section-button').click();

    cy.get('.ti-element-button').click();
  });
  it('should add box to scene', () => {
    cy.get('.ti-menu-element-box').click();
    cy.get('.ti-add-element-button').click();

    cy.get('.ti-box').should('have.length', 1);
  });
  it('should add sns to scene', () => {
    cy.get('.ti-element-sns-button').click();
    cy.get('.ti-add-element-button').click();

    cy.get('.sns').should('have.length', 1);
  });
});
