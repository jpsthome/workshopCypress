class ProductPage{

	adicionaProdutoCarrinho(){
			// Seleciona tamanho M e cor Verde pra blusa
			cy.get('.button-variable-item-M').click();
			cy.get('.button-variable-item-Green').click();
	
			// Adiciona blusa no carrinho
			cy.get('.single_add_to_cart_button').click();
	}

}
export default new ProductPage