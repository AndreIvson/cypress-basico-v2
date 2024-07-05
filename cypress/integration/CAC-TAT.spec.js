/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
    const tres_segundos = 3000
    beforeEach(function () {
        cy.visit('./src/index.html')
    })

    it('1. verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('2. preenche os campos obrigatórios e envia o formulário', function () {
        const longText = 'Lorem ipsum dolor sit amet. Aut dolor quidem eos galisum delectus ab internos eaque ea beatae quibusdam ea magni voluptate. Aut eligendi earum eos quia ullam aut voluptatem optio est consequuntur asperiores. Et temporibus pariatur ut consequatur sint id voluptatem similique id laudantium maxime in beatae libero. Et quia sint eos voluptas iste aut quae alias qui ducimus labore!'

        cy.clock()

        cy.get('#firstName').type('André')
        cy.get('#lastName').type('Silva')
        cy.get('#email').type('andre@email.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(tres_segundos)

        cy.get('.success').should('not.be.visible')
    })

    it('3. exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        cy.clock()

        cy.get('#firstName').type('André')
        cy.get('#lastName').type('Silva')
        cy.get('#email').type('andre@')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(tres_segundos)

        cy.get('.error').should('not.be.visible')
    })

    it('4. campo telefone continua vazio quando preenchido com valor não-numérico', function () {
        cy.get('#phone')
            .type('ABCabc!@#$')
            .should('have.value', '')
    })

    it('5. exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.clock()

        cy.get('#firstName').type('André')
        cy.get('#lastName').type('Silva')
        cy.get('#email').type('andre@email.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(tres_segundos)

        cy.get('.error').should('not.be.visible')
    })

    it('6. preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        cy.get('#firstName')
            .type('André')
            .should('have.value', 'André')
            .clear()
            .should('have.value', '')

        cy.get('#lastName')
            .type('Silva')
            .should('have.value', 'Silva')
            .clear()
            .should('have.value', '')

        cy.get('#email')
            .type('andre@email.com')
            .should('have.value', 'andre@email.com')
            .clear()
            .should('have.value', '')

        cy.get('#phone')
            .type(81992358081)
            .should('have.value', '81992358081')
            .clear()
            .should('have.value', '')
    })

    it('7. exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        cy.clock()

        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')

        cy.tick(tres_segundos)

        cy.get('.error').should('not.be.visible')
    })

    it('8. envia o formuário com sucesso usando um comando customizado', function () {
        cy.clock()

        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')

        cy.tick(tres_segundos)

        cy.get('.success').should('not.be.visible')

    })

    it('9. seleciona um produto (YouTube) por seu texto', function () {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })

    it('10. seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('11. seleciona um produto (Blog) pelo seu índice', function () {
        cy.get('#product')
            .select([1])
            .should('have.value', 'blog')
    })

    it('12. marcar o tipo de atendimento "Feedback" ', function () {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    it('13. marca cada tipo de atendimento', function () {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    it('14. marca ambos os checkboxes, depois desmarca o ultimo', function(){
        cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
    })

    it('15. seleciona um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })
    it('16. seleciona um arquivo simulando um drag-and-drop', function () {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('17. seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })
    it('18. verifica que a politica de privacidade abre em uma outra aba sem necessidade de clique', function () {
        cy.get('#privacy a')
            .should('have.attr', 'target', '_blank')
    })

    it('19. acessa a página de politica de privacidade removendo o target e então clicando no link', function () {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
    })
})