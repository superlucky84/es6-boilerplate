describe('PanelTools', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');

    cy.get('.menuBtn').click();

    // 섹션 추가
    cy.get('.ti-section-button').click();
    cy.get('.ti-add-section-button').click();
  });
  describe('z-index control', () => {
    beforeEach(() => {
      cy.get('.ti-element-button').click();
      cy.get('.ti-menu-element-image').click();
      cy.get('.btn-blue').click();
      cy.get('.ti-menu-element-text').click();
      cy.get('.btn-blue').click();
      cy.get('.ti-menu-element-box').click();
      cy.get('.btn-blue').click();

      cy.get('.menuBtn').click();

      cy.get('.ti-box').click();

      cy.get('.ti-panel-x-input').type('420');

      cy.get('.text').click();

      cy.get('.ti-panel-x-input').type('210');
    });
    it('Element to forward', () => {
      cy.get('.ti-image')
        .parent('.__element_wrapper')
        .should('have.css', 'z-index', '100');

      cy.get('.ti-image').click();

      cy.get('.ti-element-to-forward').click();

      // 선택상태를 풀기위해(포탈에 있어서 z-index가 계산 안됨)
      cy.get('.ti-section').click({position: 'right', force: true});

      // 뷰가 다시그렸기 때문에 순서가 바뀜
      cy.get('.ti-image')
        .parent('.__element_wrapper')
        .should('have.css', 'z-index', '101');
    });
    it('Element to backward', () => {
      cy.get('.ti-image').click();
      cy.get('.ti-element-to-forward').click();

      cy.get('.ti-box').click();
      cy.get('.ti-element-to-backward').click();

      // 선택상태를 풀기위해
      cy.get('.ti-section').click({position: 'right', force: true});

      cy.get('.ti-image')
        .parent('.__element_wrapper')
        .should('have.css', 'z-index', '102');

      cy.get('.ti-box')
        .parent('.__element_wrapper')
        .should('have.css', 'z-index', '101');

      cy.get('.text')
        .parent('.__element_wrapper')
        .should('have.css', 'z-index', '100');
    });
    it('Element to front', () => {
      cy.get('.ti-image').click();

      cy.get('.ti-element-to-front').click();

      // 선택상태를 풀기위해
      cy.get('.ti-section').click({position: 'right', force: true});

      // 뷰가 다시그렸기 때문에 순서가 바뀜
      cy.get('.ti-image')
        .parent('.__element_wrapper')
        .should('have.css', 'z-index', '102');
    });
    it('Element to back', () => {
      cy.get('.ti-box').click();

      cy.get('.ti-element-to-back').click();

      // 선택상태를 풀기위해
      cy.get('.ti-section').click({position: 'right', force: true});

      // 뷰가 다시그렸기 때문에 순서가 바뀜
      cy.get('.ti-box')
        .parent('.__element_wrapper')
        .should('have.css', 'z-index', '100');
    });
  });
});
