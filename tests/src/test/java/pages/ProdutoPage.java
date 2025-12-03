package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class ProdutoPage {

	private WebDriver driver;

	// === Locators da página ===
	private By botaoAbrirModal = By.id("prod-button-admin");

	private By selectCategoria = By.id("prod-select-categoria");
	private By inputNome = By.id("prod-input-nome");
	private By inputDescricao = By.id("prod-input-descricao");
	private By inputPreco = By.id("prod-input-preco");
	private By inputEstoque = By.id("prod-input-estoque");

	private By botaoCadastrar = By.id("prod-btn-confirm");

	// Popup de sucesso
	private By popupSucesso = By.xpath("//div[contains(text(),'Produto cadastrado com sucesso.')]");
	private By botaoOkPopup = By.xpath("//button[contains(text(),'OK')]");

	public ProdutoPage(WebDriver driver) {
		this.driver = driver;
	}

	// Acessa diretamente a página
	public void abrirPaginaProduto(String url) {
		driver.get(url);
	}

	public void abrirModalCadastro() {
		driver.findElement(botaoAbrirModal).click();
	}

	public void preencherFormularioProduto(String categoria, String nome, String descr, String preco, String estoque) {

		// Seleciona categoria
		driver.findElement(selectCategoria).click();
		driver.findElement(By.xpath("//option[contains(text(),'" + categoria + "')]")).click();

		// Preenche campos
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