describe('History', () => {
  describe('Save history', () => {
    it('should be saved when save contents', () => {
      cy.visit('http://localhost:8080/');
      cy.get('.menuBtn').click();

      cy.get('.ti-section-button').click();
      cy.get('.ti-add-section-button').click();

      cy.get('.ti-save-button').click();
      cy.get('.ti-history-button').click();

      cy.get('.ti-history').should('have.length', 1);
    });
  });

  describe('Using saved history', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8080/', {
        onBeforeLoad: () => {
          localStorage.setItem(
            'index',
            '[{"id":1534905622134,"pageId":"index","timestamp":1534905622134,"contents":{"title":"메인(필수)","url":"메인url","background":{"type":"color","value":"#fff"},"sectionIds":["rkRGarqIm"],"elements":{"rkRGarqIm":{"type":"section","children":["HkxCf6HqIm"],"attrs":{"dimension":{"height":170},"column":1,"color":"","image":{}},"id":"rkRGarqIm"},"HkxCf6HqIm":{"type":"column","children":[],"id":"HkxCf6HqIm","parentId":"rkRGarqIm"}}}}]'
          );
        }
      });
    });
    it('should load saved history list after start up', () => {
      cy.get('.ti-history-button').click();
      cy.get('.ti-history').should('have.length', 1);
    });

    it('could load history contents', () => {
      cy.get('.menuBtn').click();
      cy.get('.ti-section-button').click();
      cy.get('.ti-add-section-button').click();
      cy.get('.ti-add-section-button').click();
      cy.get('.menuBtn').click();

      cy.get('.ti-section').should('have.length', 2);

      cy.get('.ti-history-button').click();
      cy.get('.ti-history').click();

      cy.get('.ti-popup-yes-button').click();

      cy.get('.ti-section').should('have.length', 1);
    });
  });
});
