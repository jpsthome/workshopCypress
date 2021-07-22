class CheckoutPage{
	preencheFormulario(data){
		cy.get('#billing_first_name').type(data.nome);
		cy.get('#billing_last_name').type(data.sobrenome);

		// Testa se é possível fazer a pesquisa pelo nome do país desejado no campo de select
		// baseado no tutorial do blog do cypress: https://www.cypress.io/blog/2020/03/20/working-with-select-elements-and-select2-widgets-in-cypress/
		this.selecionaPais(data.endereco.pais.nome,data.endereco.pais.cod);

		//Preenche endereço e cidade
		cy.get('#billing_address_1').type(`${data.endereco.rua}, ${data.endereco.numero}`);
		cy.get('#billing_city').type(data.endereco.cidade);

		this.selecionaEstado(data.endereco.estado.nome,data.endereco.estado.cod);

		cy.get('#billing_postcode').type(data.endereco.cep);
		cy.get('#billing_phone').type(data.telefone);
		cy.get('#billing_email').type(data.email)
	}

	selecionaPais(nome, codigo){
		cy.get('#select2-billing_country-container').click();
		cy.get('.select2-search__field').type(`${nome}{enter}`);
		cy.get('#billing_country').should('have.value', codigo);
	};
	
	selecionaEstado(nome, codigo){
		cy.get('#select2-billing_state-container').click();
		cy.get('.select2-search__field').type(`${nome}{enter}`);
		cy.get('#billing_state').should('have.value', codigo);
	};

}
export default new CheckoutPage