Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Anderson')
    cy.get('#lastName').type('Weber Júnior')
    cy.get('#email').type('teste@teste.com')
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()
})