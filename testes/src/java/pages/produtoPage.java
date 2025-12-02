package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProdutoPage {

	private WebDriver driver;

	// === Locators (placeholders por enquanto) ===
	private By botaoAbrirModal = By.id("prod-button-admin");
	private By selectCategoria = By.xpath("prod-select-categoria");  // AJUSTAR depois
	private By inputNome = By.xpath("prod-input-nome"); // AJUSTAR
	private By inputDescricao = By.xpath("prod-input-descricao"); // AJUSTAR
	private By inputPreco = By.xpath("prod-input-preco"); // AJUSTAR
	private By inputEstoque = By.xpath("prod-input-estoque"); // AJUSTAR
	private By botaoCadastrar = By.xpath("prod-btn-confirm");
	private By botaoOkPopup = By.xpath("//button[contains(text(),'OK')]"); // AJUSTAR

	public ProdutoPage(WebDriver driver) {
		this.driver = driver;
	}

	public void abrirPaginaProduto(String url) {
		driver.get(url);
	}

	public void abrirModalCadastro() {
		driver.findElement(botaoAbrirModal).click();
	}

	public void preencherFormularioProduto(String categoria, String nome, String descr, String preco, String estoque) {

		// Selecionar categoria
		driver.findElement(selectCategoria).click();
		// ... selecionar opção (vamos ajustar depois)

		// Preencher campos
		driver.findElement(inputNome).sendKeys(nome);
		driver.findElement(inputDescricao).sendKeys(descr);
		driver.findElement(inputPreco).sendKeys(preco);
		driver.findElement(inputEstoque).sendKeys(estoque);
	}

	public void confirmarCadastro() {
		driver.findElement(botaoCadastrar).click();
	}

	public boolean validarPopupSucesso() {
		return driver.findElement(popupSucesso).isDisplayed();
	}

	public void fecharPopup() {
		driver.findElement(botaoOkPopup).click();
	}
}
