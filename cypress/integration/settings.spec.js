describe('Settings', () => {
  it('could change font of pages and scene', () => {
    cy.visit('http://localhost:8080/');
    cy.get('.menuBtn').click();

    cy.get('.ti-settings-button').click();
    cy.get('.ti-font-select').select('Arial');

    cy.get('.page, .ti-scene').should(
      'have.css',
      'font-family',
      'Arial, NanumGothic, ng, 돋움, Dotum, "Apple SD Gothic Neo", sans-serif'
    );
  });
});
