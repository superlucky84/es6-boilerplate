describe('Sns', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('.menuBtn').click();

    cy.get('.ti-section-button').click();
    cy.get('.ti-add-section-button').click();

    cy.get('.ti-element-button').click();

    cy.get('.ti-element-sns-button').click();
    cy.get('.ti-add-element-button').click();

    cy.get('.menuBtn').click();
  });
  it('should change img layout when element resize', () => {
    cy.get('.sns').click({force: true});
    cy.get('.right-resize').trigger('mousedown', {force: true});
    cy.get('.right-resize').trigger('mousemove', {which: 1, pageX: 500, force: true});

    cy.get('.sns').should('have.css', 'width', '500px');
  });
});
