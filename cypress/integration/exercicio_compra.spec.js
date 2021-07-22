/// <reference types = "cypress"/>

// FAZER UMA COMPRA
// NÃO É NECESSÁRIO CADASTRO OU LOGIN PRA FECHAR A COMPRA
// O USUÁRIO DEVE CLICAR NO MENU DE COMPRAR
// SELECIONAR O PRIMEIRO PRODUTO DA LISTA
// CAMINHO FELIZ

import CheckoutPage from '../support/pageObjects/checkout'
import ProductPage from '../support/pageObjects/product'
const data = require('../fixtures/checkout.json')

context("Compra", ()=>{

	beforeEach(()=>{
		// Foi adicionado um baseUrl -> https://docs.cypress.io/guides/references/best-practices#Setting-a-global-baseUrl
		// Como a navegação até a página da loja já foi testada em outros arquivos, pulei essa etapa
		cy.visit('/shop');
	})

	// Teste sem nenhuma estratégia de boas práticas
	it("o usuario deve conseguir realizar uma compra do primeiro produto na loja - simples", ()=>{
		// Seleciona o primeiro produto
		cy.get('.post-2559 > .product-block').click();

		// Seleciona tamanho M e cor Verde pra blusa
		cy.get('.button-variable-item-M').click();
		cy.get('.button-variable-item-Green').click();

		// Adiciona blusa no carrinho
		cy.get('.single_add_to_cart_button').click();

		
		// Clica no botão que redireciona ao checkout
		cy.contains('.woocommerce-message','foi adicionado no seu carrinho').should('be.visible')
		cy.get('.woocommerce-message > .button').click();
		cy.get('.checkout-button').click();

		// Preenche formulario de Detalhes de Faturamento
		cy.get('#billing_first_name').type(data.nome);
		cy.get('#billing_last_name').type(data.sobrenome);

		// Testa se é possível fazer a pesquisa pelo nome do país desejado no campo de select
		// baseado no tutorial do blog do cypress: https://www.cypress.io/blog/2020/03/20/working-with-select-elements-and-select2-widgets-in-cypress/
		cy.get('#select2-billing_country-container').click();
		cy.get('.select2-search__field').type(`${data.endereco.pais.nome}{enter}`);
		cy.get('#billing_country').should('have.value', data.endereco.pais.cod);

		//Preenche endereço e cidade
		cy.get('#billing_address_1').type(`${data.endereco.rua}, ${data.endereco.numero}`);
		cy.get('#billing_city').type(data.endereco.cidade);


		cy.get('#select2-billing_state-container').click();
		cy.get('.select2-search__field').type(`${data.endereco.estado.nome}{enter}`);
		cy.get('#billing_state').should('have.value', data.endereco.estado.cod);

		cy.get('#billing_postcode').type(data.endereco.cep);
		cy.get('#billing_phone').type(data.telefone);
		cy.get('#billing_email').type(data.email)

		cy.get('#place_order').click();

		cy.get('.page-title').should('contain','Pedido recebido');
		cy.url().should('contain', 'order-received');

	});

	// Teste usando algumas estratégias de boas práticas
	it.only("o usuario deve conseguir realizar uma compra do primeiro produto na loja - complexo", ()=>{
		// Seleciona o primeiro produto
		cy.get('.post-2559 > .product-block').click();

		// Adiciona o produto no carrinho
		// Estou em dúvida se isso aqui realmente vale a pena, se possível gostaria que a professora
		// comente sobre isso aqui.
		ProductPage.adicionaProdutoCarrinho();

		// Verifica se o preço do produto é adicionado no menu superior
		cy.get('.summary > .price').then((price)=>{
			const valorProduto = price.text();
			cy.get('.sub-title > .woocommerce-Price-amount > bdi').should('contain',valorProduto)
		});

		// Verifica se adicionou os produtos no carrinho no menu superior
		cy.get("#cart").click();
		cy.get('.dropdown-toggle > .mini-cart-items').should('contain', '1')
		cy.contains('#cart > .dropdown-menu','Abominable Hoodie').should('be.visible')		
		cy.get("#cart").click();

		// Clica no botão que redireciona ao carrinho e depois ao checkout
		cy.contains('.woocommerce-message','foi adicionado no seu carrinho').should('be.visible')
		cy.get('.woocommerce-message > .button').click();
		cy.get('.checkout-button').click();

		// Preenche formulario de Detalhes de Faturamento
		CheckoutPage.preencheFormulario(data);

		// Finaliza o pedido e confere se o mesmo deu certo
		cy.get('#place_order').click();
		cy.get('.page-title').should('contain','Pedido recebido');
		cy.url().should('contain', 'order-received');
	})

})