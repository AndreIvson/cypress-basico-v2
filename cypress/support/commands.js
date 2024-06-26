Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
        cy.get('#firstName').type('André')
        cy.get('#lastName').type('Silva')
        cy.get('#email').type('andre@email.com')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()
})