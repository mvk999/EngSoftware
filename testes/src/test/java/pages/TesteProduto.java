package tests;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import pages.LoginPage;
import pages.ProdutoPage;

public class TesteProduto {

	private WebDriver driver;
	private LoginPage loginPage;
	private ProdutoPage produtoPage;

	@Before
	public void setUp() {
		System.setProperty("webdriver.chrome.driver", "/home/marcos/webdrivers/chromedriver");

		driver = new ChromeDriver();
		driver.manage().window().maximize();

		loginPage = new LoginPage(driver);
		produtoPage = new ProdutoPage(driver);
	}

	@Test
	public void testeCadastroProduto() throws InterruptedException {

		// === LOGIN ===
		loginPage.abrirPaginaLogin();
		loginPage.fazerLogin("admin@vought.com", "admin123");

		// === NAVEGAR PARA A TELA DE PRODUTOS ===
		produtoPage.abrirPaginaProduto("http://localhost:5173/produtos"); // Corrigido aqui

		Thread.sleep(1000);

		// === ABRIR MODAL ===
		produtoPage.abrirModalCadastro();

		Thread.sleep(500);

		// === PREENCHER FORMULÁRIO ===
		produtoPage.preencherFormularioProduto(
				"Periféricos",
				"Produto Teste",       // nome
				"Descrição Teste",     // descr
				"59.90",               // preco
				"20"                   // estoque
		);

		Thread.sleep(500);

		// === CONFIRMAR CADASTRO ===
		produtoPage.confirmarCadastro();

		Thread.sleep(800);

		// === VALIDAR POPUP ===
		assert produtoPage.validarPopupSucesso() : "Popup de sucesso NÃO apareceu!";

		// === FECHAR POPUP ===
		produtoPage.fecharPopup();
	}

	@After
	public void tearDown() {
		driver.quit();
	}
}
