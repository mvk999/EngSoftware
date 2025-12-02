package tests;

import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import pages.ProdutoPage;
import utils.DriverFactory;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ProdutoCRUDTest {

	private static WebDriver driver;
	private static ProdutoPage produtoPage;

	@BeforeAll
	public static void setUp() {
		driver = DriverFactory.getDriver();
		produtoPage = new ProdutoPage(driver);
	}

	@AfterAll
	public static void tearDown() {
		DriverFactory.quitDriver();
	}

	@Test
	@Order(1)
	public void testCadastrarProduto() {

		produtoPage.abrirPaginaProduto("http://localhost:3000/produtos");

		produtoPage.abrirModalCadastro();

		produtoPage.preencherFormularioProduto(
				"Categoria Teste",
				"Produto Automação",
				"Criado via Selenium",
				"59.90",
				"20"
		);

		produtoPage.confirmarCadastro();

		Assertions.assertTrue(produtoPage.validarPopupSucesso(),
				"O popup de sucesso NÃO apareceu!");

		produtoPage.fecharPopup();
	}
}
