describe('Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/', {
      onBeforeLoad(win) {
        cy.stub(win, 'open').as('windowOpen');
      }
    });
    cy.get('.menuBtn').click();
  });

  describe('Page Menu', () => {
    beforeEach(() => {
      cy.get('.ti-global-menu .ti-page-button').click();
    });
    it('could open page popup', () => {
      cy.get('.ti-global-menu .open .ti-popup-title').should('have.text', '페이지 배경');
    });
    it('could tab works correctly', () => {
      cy.get('.ti-tab-button')
        .eq(1)
        .click();
      cy.get('.ti-image-tab').should('to.be.visible');
      cy.get('.ti-colorpicker-tab').should('to.not.be.visible');
      cy.get('.ti-tab-button')
        .eq(0)
        .click();
      cy.get('.ti-image-tab').should('to.not.be.visible');
      cy.get('.ti-colorpicker-tab').should('to.be.visible');
    });
    it('should change color section in popup when color is selected', () => {
      cy.get('.tui-colorpicker-palette-button')
        .eq(0)
        .click();
      cy.get('.ti-bg-demo').should('have.css', 'background-color', 'rgb(0, 0, 0)');
    });
    it('after color applied to current page, the color should be initial color of menu ', () => {
      cy.get('.tui-colorpicker-palette-button')
        .eq(10)
        .click();
      cy.get('.ti-apply-to-current-page-button').click();
      cy.get('body').click();
      cy.get('.menuBtn').click();
      cy.get('.ti-global-menu .ti-page-button').click();
      cy.get('.ti-bg-demo').should('have.css', 'background-color', 'rgb(255, 187, 59)');
    });

    it('after image applied to current page, the image should be initial image of menu ', () => {
      cy.get('.ti-tab-button')
        .eq(1)
        .click();

      cy.get('.ti-image-item').then($items => {
        const firstImageItemSrc = $items
          .eq(0)
          .find('img')
          .attr('src');

        $items.eq(0).click();

        cy.get('.ti-apply-to-current-page-button').click();
        cy.get('body').click();
        cy.get('.menuBtn').click();
        cy.get('.ti-global-menu .ti-page-button').click();
        cy.get('.ti-bg-demo img').should('have.attr', 'src', firstImageItemSrc);
      });
    });
  });
  describe('Save page', () => {
    beforeEach(() => {
      cy.get(':nth-child(3) > .linkon').click();
      cy.get('.foot_btn').click();
    });
    it('should save page with save button', () => {
      cy.get('.ti-save-button').click();
      cy.get('.ti-undo-button').should('have.class', 'disable');

      // 페이지 전환
      cy.get('.ti-change-page-button').click();
      cy.get('.ti-select-page-button')
        .eq(1)
        .click();
      cy.get('.ti-change-page-button').click();
      cy.get('.ti-select-page-button')
        .eq(0)
        .click();

      cy.get('.ti-section').then($sections => {
        expect($sections).to.have.length(1);
      });
    });
    it('Popup before change page that has been modified', () => {
      cy.get('.ti-change-page-button').click();
      cy.get('.ti-select-page-button')
        .eq(1)
        .click();

      cy.get('.ti-popup').should('exist');

      cy.get('.ti-popup-yes-button').click();

      cy.get('.ti-undo-button').should('have.class', 'disable');

      // 페이지 전환
      cy.get('.ti-change-page-button').click();
      cy.get('.ti-select-page-button')
        .eq(1)
        .click();
      cy.get('.ti-change-page-button').click();
      cy.get('.ti-select-page-button')
        .eq(0)
        .click();

      cy.get('.ti-section').then($sections => {
        expect($sections).to.have.length(1);
      });
    });
    it.skip('System popup before quit browser while page editing', () => {
      cy.get('body').type('{meta}w');

      cy.on('window:before:load', () => {
        console.log('awefawefew');
      });

      // cy.reload() 유저의 동작이 아니라고 이벤트가 발생안하고
      // cy.get('body').type('{meta}w'); 로 닫기를 시도하면 작동하지 않는다.
    });
  });
  describe('Page background', () => {
    beforeEach(() => {
      cy.get('.ti-global-menu .ti-page-button').click();
    });
    it('after color applied to current page, should apply background color to current page ', () => {
      cy.get('.tui-colorpicker-palette-button')
        .eq(10)
        .click();
      cy.get('.ti-apply-to-current-page-button').click();
      cy.get('.page')
        .eq(1)
        .should('have.css', 'background-color', 'rgb(255, 187, 59)');
    });

    it('after image applied to current page, should apply background image to current page ', () => {
      cy.get('.ti-tab-button')
        .eq(1)
        .click();

      cy.get('.ti-image-item').then($items => {
        const firstImageItemSrc = $items
          .eq(0)
          .find('img')
          .attr('src');

        $items.eq(0).click();

        cy.get('.ti-apply-to-current-page-button').click();

        cy.get('.page')
          .eq(1)
          .then($page => {
            expect($page.css('background-image')).to.contain(firstImageItemSrc);
          });
      });
    });

    it('after color applied to all page, should apply background color to current page and another pages', () => {
      cy.get('.tui-colorpicker-palette-button')
        .eq(10)
        .click();
      cy.get('.ti-apply-to-all-page-button').click();
      cy.get('.page')
        .eq(1)
        .should('have.css', 'background-color', 'rgb(255, 187, 59)');
      cy.get('.ti-change-page-button').click();
      cy.get('.ti-select-page-button')
        .eq(1)
        .click();
      cy.get('.page').should('have.css', 'background-color', 'rgb(255, 187, 59)');
      cy.get('.ti-change-page-button').click();
      cy.get('.ti-select-page-button')
        .eq(2)
        .click();
      cy.get('.page').should('have.css', 'background-color', 'rgb(255, 187, 59)');
    });

    it('after image applied to all page, should apply background image to current page and another pages', () => {
      cy.get('.ti-tab-button')
        .eq(1)
        .click();

      cy.get('.ti-image-item').then($items => {
        const firstImageItemSrc = $items
          .eq(0)
          .find('img')
          .attr('src');

        $items.eq(0).click();

        cy.get('.ti-apply-to-all-page-button').click();

        cy.get('.page')
          .eq(1)
          .then($page => {
            expect($page.css('background-image')).to.contain(firstImageItemSrc);
          });

        cy.get('.ti-change-page-button').click();
        cy.get('.ti-select-page-button')
          .eq(1)
          .click();

        cy.get('.page').then($page => {
          expect($page.css('background-image')).to.contain(firstImageItemSrc);
        });
        cy.get('.ti-change-page-button').click();
        cy.get('.ti-select-page-button')
          .eq(2)
          .click();

        cy.get('.page').then($page => {
          expect($page.css('background-image')).to.contain(firstImageItemSrc);
        });
      });
    });
  });

  describe('Publish page', () => {
    it('link received by the callback should be output.', () => {
      cy.get('.ti-publish-button').click();
      cy.get('.ti-popup p').should('be.text', 'http://alpha-admin.readyshop.co.kr/login');
    });
  });

  describe('Preview page', () => {
    it('should open page with preview button', () => {
      cy.get('.ti-preview-button').click();
      cy.get('@windowOpen').should('be.calledWith', 'http://alpha-admin.readyshop.co.kr/login');
    });
  });

  describe('link', () => {
    it('admin link', () => {
      cy.viewport(1700, 750);
      cy.get('.ti-link-admin > a').then($ATAG => {
        expect($ATAG[0].href).to.equal('http://admin.readyshop.co.kr/');
      });
    });
  });
});
