package tests;

import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;
import pages.LoginPage;
import pages.ProdutoPage;
import utils.DriverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.File;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ProdutoCRUDTest {

	private static final Logger logger = LoggerFactory.getLogger(ProdutoCRUDTest.class);

	private static WebDriver driver;
	private static ProdutoPage produtoPage;
	private static LoginPage loginPage;
	private static WebDriverWait wait;

	@BeforeAll
	public static void setUp() {
		// Cria o diretório de logs fora do target, dentro do projeto
		File logDir = new File("logs");
		if (!logDir.exists()) {
			boolean criado = logDir.mkdirs();
			if (criado) {
				System.out.println("Diretório de logs criado: " + logDir.getAbsolutePath());
			} else {
				System.out.println("Falha ao criar diretório de logs: " + logDir.getAbsolutePath());
			}
		}

		driver = DriverFactory.getDriver();
		produtoPage = new ProdutoPage(driver);
		loginPage = new LoginPage(driver);
		wait = new WebDriverWait(driver, Duration.ofSeconds(10));

		logger.info("Driver iniciado e páginas carregadas.");
	}


	@AfterAll
	public static void tearDown() {
		DriverFactory.quitDriver();
		logger.info("Driver finalizado.");
	}

	@Test
	@Order(1)
	public void testCadastrarProduto() {
		logger.info("Iniciando teste: testCadastrarProduto");

		logger.info("Abrindo página de login...");
		loginPage.abrirPaginaLogin();
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email-input")));
		logger.info("Página de login carregada.");

		logger.info("Realizando login...");
		loginPage.fazerLogin("admin@vought.com", "admin123");
		logger.info("Login realizado com sucesso.");

		wait.until(ExpectedConditions.elementToBeClickable(By.id("btn-produto")));
		driver.findElement(By.id("btn-produto")).click();
		logger.info("Botão produtos clicado.");

		wait.until(ExpectedConditions.elementToBeClickable(By.id("btn-cadastrar-produto")));
		driver.findElement(By.id("btn-cadastrar-produto")).click();
		logger.info("Botão cadastrar produto clicado.");

		produtoPage.abrirModalCadastro();
		logger.info("Modal de cadastro visível.");

		produtoPage.preencherFormularioProduto(
				"Periféricos",
				"Produto Teste",
				"Descrição Teste",
				"59.90",
				"20"
		);

		produtoPage.confirmarCadastro();

		boolean popupValido = produtoPage.validarPopupSucesso();
		logger.info("Popup de sucesso validado: {}", popupValido);

		Assertions.assertTrue(popupValido, "O popup de sucesso NÃO apareceu!");
		produtoPage.fecharPopup();
	}
}
