/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    const threeMiliSeconds = 3000
    beforeEach(function(){
        cy.visit('./src/index.html')
    })

    it('Verifica o título da aplicação', function() {
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
    })

    Cypress._.times(3, function(){
        it('Preenche os campos obrigatórios e envia o formulário', function(){
            cy.clock()

            const longText = Cypress._.repeat('Teste ', 30)
            cy.get('#firstName').type('Anderson')
            cy.get('#lastName').type('Weber Júnior')
            cy.get('#email').type('teste@teste.com')
            cy.get('#open-text-area').type(longText, {delay:0})
            cy.contains('button', 'Enviar').click()

            cy.get('.success').should('be.visible')

            cy.tick(threeMiliSeconds)
            cy.get('.success').should('not.be.visible')
        })
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.clock()
        cy.get('#firstName').type('Anderson')
        cy.get('#lastName').type('Weber Júnior')
        cy.get('#email').type('teste@teste,com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(threeMiliSeconds)
        cy.get('.error').should('not.be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor nao numerico', function(){
        cy.get('#phone').type('9teste').should('have.value', '9')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.clock()
        cy.get('#firstName').type('Anderson')
        cy.get('#lastName').type('Weber Júnior')
        cy.get('#email').type('teste@teste.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
        cy.tick(threeMiliSeconds)
        cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa os campos', function(){
        cy.get('#firstName')
            .type('Anderson')
            .should('have.value', 'Anderson')
            .clear()
            .should('have.value', '')

        cy.get('#lastName')
            .type('Weber Júnior')
            .should('have.value', 'Weber Júnior')
            .clear()
            .should('have.value', '')

        cy.get('#email')
            .type('teste@teste,com')
            .should('have.value', 'teste@teste,com')
            .clear()
            .should('have.value', '')

        cy.get('#open-text-area')
            .type('teste')
            .should('have.value', 'teste')
            .clear()
            .should('have.value', '')
            
        cy.get('#phone-checkbox').check()

        cy.get('#phone')
            .type('99999999')
            .should('have.value', '99999999')
            .clear()
            .should('have.value', '')
    })

    it('acessar e enviar, receber mensagem de erro', function(){
        cy.clock()
        cy.contains('button', 'Enviar').click()
        
        cy.get('.error').should('be.visible')
        cy.tick(threeMiliSeconds)
        cy.get('.error').should('not.be.visible')
    })  

    it('enviar formulario com comando personalizado', function(){
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
        cy.tick(threeMiliSeconds)
        cy.get('.success').should('not.be.visible')
    })  

    it('selecione um produto pelo texto (YouTube)', function(){
        
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })  

    it('selecione um produto pelo valor (mentoria)', function(){
        
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('selecione um produto pelo indice (blog)', function(){
        
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento Feedback', function(){
        
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('be.checked')

    })

    it('marca cada tipo de atendimento', function(){
        
        cy.get('input[type="radio"]')
            .should('have.length',3)
            .each(function($radio){
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    it('marca checkbox e desmarca 1', function(){
        
        cy.get('input[type="checkbox"]')
            .check()
            .last().uncheck()
            .should('not.be.checked')

        cy.get('input[type="checkbox"]')
            .check()
            .first().uncheck()
            .should('not.be.checked')

        cy.get('input[type="checkbox"]').check()
        cy.get('#phone-checkbox').uncheck() 
        cy.get('input[type="checkbox"]').last().should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function(){
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo simulando drag and drop', function(){
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
            .should(function($input){
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('sampleFile')
        cy.get('#file-upload')
        .selectFile('@sampleFile')
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a').invoke('removeAttr', 'target').click()
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT - Política de privacidade')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
    })

    it('preencge a area de texto usando o comando invoke', function(){
        const longText = Cypress._.repeat('123456789', 20)
        cy.get('#open-text-area')
          .invoke('val', longText)
          .should('have.value', longText)
    })

    it('faz uma requisicao http', function(){
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
          .should(function(response){
            const{status, statusText, body } = response
            expect(status).to.equal(200)
            expect(statusText).to.equal('OK')
            expect(body).to.include('CAC TAT')
          })
    })

    it.only('encontra o gato', function(){
        const longText = Cypress._.repeat('123456789', 20)
        cy.get('#cat')
          .invoke('show')
          .should('be.visible')
    })
})