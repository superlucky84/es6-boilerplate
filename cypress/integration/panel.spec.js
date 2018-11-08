describe('Panel', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
  });
  describe('zIndex', () => {
    beforeEach(() => {
      cy.get('.menuBtn').click();
      cy.get('.ti-global-menu .ti-section-button').click();
      cy.get('.ti-add-section-button').click();
      cy.get('.ti-section').click();
      cy.get('.ico-img').click();
      cy.get('.ico-color').click();
    });

    it('should greater than last one', () => {
      cy.get('.ti-panel').then($panels => {
        const $imagePanel = $panels.eq(1);
        const $colorPanel = $panels.eq(2);

        expect($colorPanel.css('zIndex')).to.gt($imagePanel.css('zIndex'));
      });
    });

    it('should greater than last one after click', () => {
      cy.get('.ti-panel')
        .eq(1)
        .click({force: true});
      cy.get('.ti-panel').then($panels => {
        const $imagePanel = $panels.eq(1);
        const $colorPanel = $panels.eq(2);

        expect($colorPanel.css('zIndex')).to.lt($imagePanel.css('zIndex'));
      });
    });

    it('panel should always be visible inside the viewport.', () => {
      cy.viewport(300, 300);
      cy.get('body').then($body => {
        const bodyWidth = parseInt($body[0].clientWidth, 10);

        cy.get('.ti-panel').then($panels => {
          setTimeout(() => {
            const expected = bodyWidth - parseInt($panels.css('width'), 10);
            expect(parseInt($panels.css('left'), 10)).to.equal(expected);
          });
        });
      });
    });
  });
});
