describe('Element Edit(copy,paste,cut,delete)', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');

    cy.get('.menuBtn').click();

    // 섹션 추가
    cy.get('.ti-section-button').click();
    cy.get('.ti-add-section-button').click();

    // 텍스트 엘리먼트 추가
    cy.get(':nth-child(4) > .linkon').click();
    cy.get('.basic_list > :nth-child(1)').click();
    cy.get('.btn-blue').click();

    // 섹션 추가
    cy.get('.ti-section-button').click();
    cy.get('.ti-add-section-button').click();

    cy.get('.menuBtn').click();
  });

  it('copy & paste', () => {
    cy.get('.text').click();
    cy.get('.ti-copy-button').click();
    cy.get('.ti-paste-button').click();

    cy.get('.text').should('have.length', 2);
  });

  it('in text editing mode, delete and arrow keys should work normally.', () => {
    cy.get('.text.itemCover')
      .dblclick()
      .type('{rightArrow}')
      .type('{rightArrow}')
      .type('{rightArrow}')
      .type('{rightArrow}')
      .type('{rightArrow}')
      .type('{backspace}')
      .type('{backspace}');

    cy.get('.text.itemCover').then($ptag => {
      expect($ptag.html()).to.equal('새 텍');
    });
  });

  it('pasted element should have the original element and the left, top 7px incremented position.', () => {
    cy.get('.text').click();
    cy.get('.ti-copy-button').click();
    cy.get('.ti-paste-button').click();
    cy.get('.text').then($textElements => {
      const {left: newLeft, top: newTop} = $textElements[0].style;
      const {left: originalLeft, top: originalTop} = $textElements[1].style;
      expect(parseInt(newLeft, 10) - parseInt(originalLeft, 10)).to.equal(7);
      expect(parseInt(newTop, 10) - parseInt(originalTop, 10)).to.equal(7);
    });
  });

  it('right left move with keymap', () => {
    cy.get('.text').click();
    cy.get('.text')
      .closest('.__element_wrapper')
      .then($page => {
        const originalLeft = parseInt($page.css('left'), 10);

        for (let i = 0; i < 7; i += 1) {
          cy.get('body').type('{rightArrow}');
        }

        cy.get('.text')
          .closest('.__element_wrapper')
          .then($newPage => {
            const diffLeft = parseInt($newPage.css('left'), 10) - originalLeft;

            expect(diffLeft).to.equal(7);
          });
      });

    cy.get('.text')
      .closest('.__element_wrapper')
      .then($page => {
        const originalLeft = parseInt($page.css('left'), 10);

        for (let i = 0; i < 7; i += 1) {
          cy.get('body').type('{leftArrow}');
        }

        cy.get('.text')
          .closest('.__element_wrapper')
          .then($newPage => {
            const diffLeft = parseInt($newPage.css('left'), 10) - originalLeft;

            expect(diffLeft).to.equal(-7);
          });
      });
  });

  it('down up move with keymap', () => {
    cy.get('.text').click();
    cy.get('.text')
      .closest('.__element_wrapper')
      .then($page => {
        const originalLeft = parseInt($page.css('top'), 10);

        for (let i = 0; i < 7; i += 1) {
          cy.get('body').type('{downArrow}');
        }

        cy.get('.text')
          .closest('.__element_wrapper')
          .then($newPage => {
            const diffLeft = parseInt($newPage.css('top'), 10) - originalLeft;

            expect(diffLeft).to.equal(7);
          });
      });
    cy.get('.text')
      .closest('.__element_wrapper')
      .then($page => {
        const originalLeft = parseInt($page.css('top'), 10);

        for (let i = 0; i < 7; i += 1) {
          cy.get('body').type('{upArrow}');
        }

        cy.get('.text')
          .closest('.__element_wrapper')
          .then($newPage => {
            const diffLeft = parseInt($newPage.css('top'), 10) - originalLeft;

            expect(diffLeft).to.equal(-7);
          });
      });
  });

  it('copy & paste with keymap', () => {
    cy.get('.text').click();
    cy.get('body').type('{meta}c');
    cy.get('body').type('{meta}v');
    cy.get('.text').should('have.length', 2);
  });

  it('section copy & paste', () => {
    cy.get('.ti-section')
      .eq(0)
      .click();
    cy.get('.ti-copy-button').click();
    cy.get('.ti-paste-button').click();

    cy.get('.ti-section').should('have.length', 3);
  });

  it('cut & paste', () => {
    cy.get('.text').click();
    cy.get('.ti-cut-button').click();
    cy.get('.ti-paste-button').click();

    cy.get('.text').should('have.length', 1);
  });
  it('cut & paste with keymap', () => {
    cy.get('.text').click();
    cy.get('body').type('{meta}x');
    cy.get('body').type('{meta}v');
    cy.get('.text').should('have.length', 1);
  });
  it('section cut & paste', () => {
    cy.get('.ti-section')
      .eq(0)
      .click();
    cy.get('.ti-cut-button').click();
    cy.get('.ti-paste-button').click();

    cy.get('.ti-section').should('have.length', 2);
  });
  it('element delete', () => {
    cy.get('.text').click();
    cy.get('.ti-delete-button').click();

    cy.get('.text').should('have.length', 0);
  });
  it('delete with keymap', () => {
    cy.get('.text').click();
    cy.get('body').type('{del}');

    cy.get('.text').should('have.length', 0);
  });
  it('delete with keymap for backspace', () => {
    cy.get('.text').click();
    cy.get('body').type('{backspace}');

    cy.get('.text').should('have.length', 0);
  });
  it('section delete', () => {
    cy.get('.ti-section')
      .eq(0)
      .click();
    cy.get('.ti-delete-button').click();

    cy.get('.ti-section').should('have.length', 1);
  });
});

describe('Element Edit(move)', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('.menuBtn').click();
    cy.get('.ti-section-button').click();
    cy.get('.ti-stage2').click();
    cy.get('.ti-add-section-button').click();
    cy.get('.ti-stage2').click();
    cy.get('.ti-add-section-button').click();
    cy.get(':nth-child(4) > .linkon').click();
  });

  it('moving a general element to a column with a reactive element should be canceled.', () => {
    cy.get('.ti-element-product-button').click();
    cy.get('.ti-product-element-add').click();
    cy.get('.menuBtn').click();
    cy.get('.ti-productlist-component').click();
    cy.get('.ti-productlist-component')
      .trigger('mousedown')
      .trigger('mousemove', {which: 1, clientX: 940, clientY: 300})
      .trigger('mouseup', {force: true});

    cy.get('.menuBtn').click();
    cy.get(':nth-child(4) > .linkon').click();
    cy.get('.basic_list > :nth-child(1)').click();
    cy.get('.btn-blue').click();
    cy.get('.menuBtn').click();
    cy.get('.text.itemCover').click();
    cy.get('.text.itemCover')
      .trigger('mousedown')
      .trigger('mousemove', {which: 1, clientX: 840, clientY: 300})
      .trigger('mouseup', {force: true});
    cy.get('.ti-editor-canvas')
      .eq(0)
      .click();
    cy.get('.text.itemCover')
      .closest('.column')
      .then(columnElement => {
        expect(columnElement.index()).to.equal(0);
      });
  });

  it('reactive element must be canceled when moving to a column where another element already exists.', () => {
    cy.get('.basic_list > :nth-child(1)').click();
    cy.get('.btn-blue').click();
    cy.get('.menuBtn').click();
    cy.get('.text.itemCover').click();
    cy.get('.text.itemCover')
      .trigger('mousedown')
      .trigger('mousemove', {which: 1, clientX: 840, clientY: 300})
      .trigger('mouseup', {force: true});

    cy.get('.menuBtn').click();
    cy.get(':nth-child(4) > .linkon').click();
    cy.get('.ti-element-product-button').click();
    cy.get('.ti-product-element-add').click();
    cy.get('.menuBtn').click();

    cy.get('.ti-productlist-component').click();
    cy.get('.ti-productlist-component')
      .trigger('mousedown')
      .trigger('mousemove', {which: 1, clientX: 940, clientY: 300})
      .trigger('mouseup', {force: true});

    cy.get('.ti-editor-canvas')
      .eq(0)
      .click();
    cy.get('.ti-productlist-component')
      .closest('.column')
      .then(columnElement => {
        expect(columnElement.index()).to.equal(0);
      });
  });
});
