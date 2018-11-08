describe('EditingPage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('.menuBtn').click();

    cy.get('.ti-section-button').click();
    cy.get('.ti-stage2').click();
    cy.get('.ti-add-section-button').click();
    cy.get('.ti-stage3').click();
    cy.get('.ti-add-section-button').click();
  });

  describe('Section', () => {
    it('Section controls should be able to change the height.', () => {
      cy.get('.ti-editor-canvas')
        .eq(1)
        .click();

      cy.get('.ti-editor-canvas.selected').then($page => {
        const originalHeight = parseInt($page.css('height'), 10);

        cy.get('.ti-editor-canvas')
          .eq(1)
          .find('.bottom-resize')
          .trigger('mousedown')
          .trigger('mousemove', {which: 1, clientX: 478, clientY: 900})
          .trigger('mouseup', {force: true});

        cy.get('.ti-editor-canvas.selected').then($page2 => {
          expect(parseInt($page2.css('height'), 10)).to.be.gt(originalHeight);
        });
      });
    });

    it('Reducing the section height will work normally when vertical scrolling is present.', () => {
      cy.get('.ti-stage3').click();
      cy.get('.ti-add-section-button').click();
      cy.get('.ti-editor-canvas')
        .eq(2)
        .click();

      cy.get('.ti-editor-canvas.selected').then($page => {
        const originalHeight = parseInt($page.css('height'), 10);

        cy.get('.ti-editor-canvas')
          .eq(2)
          .find('.bottom-resize')
          .trigger('mousedown')
          .trigger('mousemove', {which: 1, clientX: 478, clientY: 500})
          .trigger('mouseup', {force: true});

        cy.get('.ti-editor-canvas.selected').then($page2 => {
          expect(parseInt($page2.css('height'), 10)).to.be.lt(originalHeight);
        });
      });
    });

    it('Section height must be changed in the panel.', () => {
      cy.get('.ti-editor-canvas')
        .eq(1)
        .click();

      cy.get('.ti-panel-height-input').then($page => {
        const height = parseInt($page[0].value, 10);
        cy.get('.ti-panel-height-input').type('1');
        cy.get('.ti-editor-canvas')
          .eq(1)
          .should('have.css', 'height', `${height}1px`);
      });
    });

    it('section background style should be fixed when section background image scrolling is true.', () => {
      cy.get('.ti-editor-canvas:last-child').click();
      cy.get('.ico-img').click();
      cy.get('.imagePanel .image_list li:nth-child(2)').click();
      cy.get('.ti-fixed-background').click({force: true});
      cy.get('.ti-editor-canvas.selected .ti-section').should('have.css', 'background-attachment', 'fixed');
    });

    it('change the column setting from 3 to 1, must have one column holding the element.', () => {
      cy.get(':nth-child(4) > .linkon').click();
      cy.get('.basic_list > :nth-child(1)').click();
      cy.get('.btn-blue').click();
      cy.get('.text.itemCover').click();
      cy.get('.text.itemCover')
        .trigger('mousedown')
        .trigger('mousemove', {which: 1, clientX: 840, clientY: 405})
        .trigger('mouseup', {force: true});
      cy.get('.editorCanvas:last-child').click();
      cy.get('.ico-section').click();
      cy.get('.stage_list li:nth-child(1)').click();
      cy.get('.editorCanvas:last-child')
        .find('.column')
        .should('have.length', 1);
      cy.get('.text.itemCover').should('have.length', 1);
    });

    it('change the column setting panel from one to three, you should have three columns.', () => {
      cy.get('.menuBtn')
        .click()
        .click();
      cy.get('.ti-global-menu .ti-section-button').click();
      cy.get('.ti-stage1').click();
      cy.get('.ti-add-section-button').click();

      cy.get('.editorCanvas:last-child').click();
      cy.get('.ico-section').click();
      cy.get('.stage_list li:nth-child(3)').click();
      cy.get('.editorCanvas:last-child')
        .find('.column')
        .should('have.length', 3);
    });
  });

  describe('Common Element', () => {
    it('sections in the selected state must be unselected when a browser resize event occurs.', () => {
      cy.get('.ti-global-menu .ti-element-button').click();
      cy.get('.ti-element-board-button').click();
      cy.get('.ti-board-element-add').click();
      cy.get('.noticeBoard').should('have.length', 1);
      cy.get('.noticeBoard').click({force: true});
      cy.viewport(550, 750);
      cy.get('.element-transform-ui').should('have.length', 0);
    });
  });

  describe('Product', () => {
    it('default productList-component with four default items should be added.', () => {
      cy.get('.ti-global-menu .ti-section-button').click();
      cy.get('.ti-global-menu .ti-element-button').click();
      cy.get('.ti-element-product-button').click();
      cy.get('.ti-product-element-add').click();
      cy.get('.ti-productlist-component').then($page => {
        expect($page.find('li').length).to.equal(4);
      });
    });

    it('default productSlide-component with three default items should be added.', () => {
      cy.get('.ti-global-menu .ti-section-button').click();
      cy.get('.ti-global-menu .ti-element-button').click();
      cy.get('.ti-element-product-slide-button').click();
      cy.get('.ti-product-slide-element-add').click();
      cy.get('.ti-productslide-component').then($page => {
        expect($page.find('.ti-productslide-item').length).to.equal(3);
      });
    });

    it('should be able to change the number of items through the panel.', () => {
      cy.get('.ti-global-menu .ti-section-button').click();
      cy.get('.ti-global-menu .ti-element-button').click();
      cy.get('.ti-element-product-button').click();
      cy.get('.ti-product-element-add').click();
      cy.get('.ti-productlist-component').click({force: true});
      cy.get('.ico-products').click();
      cy.get('.ti-panel-prjoduct-category .exhibition3').click({force: true});
      cy.get('.ti-productlist-component').then($page => {
        expect($page.find('li').length).to.equal(3);
      });
    });
  });

  describe('Map', () => {
    it('should be able to add map elements.', () => {
      cy.get('.ti-global-menu .ti-element-button').click();
      cy.get('.ti-element-map-button').click();
      cy.get('.ti-map-element-add').click();
      cy.get('.map').should('have.length', 1);
    });
  });

  describe('Video', () => {
    it('Thumbnail should be shown first before loading youtube video.', () => {
      cy.get('.ti-global-menu .ti-element-button').click();
      cy.get('.ti-element-video-button').click();
      cy.get('.ti-videourlinput').type('https://www.youtube.com/watch?v=qIQtPWoRK5o');
      cy.get('.ti-video-element-add').click();

      cy.get('.video-inner').then($page => {
        expect($page.css('background-image')).to.contain(`url("https://img.youtube.com/vi/qIQtPWoRK5o/sddefault.jpg")`);
      });
    });

    it('should be able to add video elements.', () => {
      cy.get('.ti-global-menu .ti-element-button').click();
      cy.get('.ti-element-video-button').click();
      cy.get('.ti-videourlinput').type('https://www.youtube.com/watch?v=qIQtPWoRK5o');
      cy.get('.ti-video-element-add').click();
      cy.get('.video').should('have.length', 1);
    });

    it('wrong youtube url should not be reflected.', () => {
      cy.get('.ti-global-menu .ti-element-button').click();
      cy.get('.ti-element-video-button').click();
      cy.get('.ti-videourlinput').type('https://www.youtube.com/watch?v=qIQtPWoRK5o');
      cy.get('.ti-video-element-add').click();
      cy.get('.video').click({force: true});
      cy.get('.ico-video').click();
      cy.get('.videoPanel .ti-videourlinput-panel')
        .type('make invalid url')
        .blur()
        .should('have.value', 'https://www.youtube.com/watch?v=qIQtPWoRK5o');
    });

    it('valid youtube url should be reflected.', () => {
      cy.get('.ti-global-menu .ti-element-button').click();
      cy.get('.ti-element-video-button').click();
      cy.get('.ti-videourlinput').type('https://www.youtube.com/watch?v=qIQtPWoRK5o');
      cy.get('.ti-video-element-add').click();
      cy.get('.video').click({force: true});
      cy.get('.ico-video').click();
      cy.get('.videoPanel .ti-videourlinput-panel')
        .clear()
        .type('https://www.youtube.com/watch?v=Z7znzwbRj-g')
        .blur()
        .should('have.value', 'https://www.youtube.com/watch?v=Z7znzwbRj-g');
    });
  });

  describe('Board', () => {
    it('should be able to add board elements.', () => {
      cy.get('.ti-global-menu .ti-element-button').click();
      cy.get('.ti-element-board-button').click();
      cy.get('.ti-board-element-add').click();
      cy.get('.noticeBoard').should('have.length', 1);
    });

    it('contents of the panel should be reflected.', () => {
      cy.get('.ti-global-menu .ti-element-button').click();
      cy.get('.ti-element-board-button').click();
      cy.get('.ti-board-element-add').click();
      cy.get('.noticeBoard').should('have.length', 1);
      cy.get('.noticeBoard').click({force: true});
      cy.get('.ico-bulletin').click();
      cy.get('.ti-messagePanel .ti-board-selector').select('faq');
      cy.get('.noticeBoard .ti-boarname').should('have.text', 'faq');
    });
  });
});
