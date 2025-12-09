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

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ProdutoCRUDTest {

	private static WebDriver driver;
	private static ProdutoPage produtoPage;
	private static LoginPage loginPage;
	private static WebDriverWait wait;

	@BeforeAll
	public static void setUp() {
		driver = DriverFactory.getDriver();
		produtoPage = new ProdutoPage(driver);
		loginPage = new LoginPage(driver);
		wait = new WebDriverWait(driver, Duration.ofSeconds(10));
	}

	@AfterAll
	public static void tearDown() {
		DriverFactory.quitDriver();
	}

	@Test
	@Order(1)
	public void testCadastrarProduto() {

		// === LOGIN ===
		loginPage.abrirPaginaLogin();

		// Esperar input de email ficar visível
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email-input")));

		// Preencher login e senha
		loginPage.fazerLogin("admin@vought.com", "admin123");

		// === ESPERAR A DASHBOARD CARREGAR ===
		// Você pode esperar por algum elemento exclusivo da dashboard
		//wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("btn-produto"))); // ajuste para o id real da lateral

		// === CLICAR NA OPÇÃO PRODUTO NA LATERAL ===
		wait.until(ExpectedConditions.elementToBeClickable(By.id("btn-produto"))); // ajuste para o id real do botão/links
		driver.findElement(By.id("btn-produto")).click();

		// === ESPERAR PÁGINA DE PRODUTOS CARREGAR ===
		wait.until(ExpectedConditions.elementToBeClickable(By.id("prod-button-admin"))); // ajuste para o id real do botão/links
		driver.findElement(By.id("prod-button-admin")).click();

		// === ABRIR MODAL DE CADASTRO ===
		produtoPage.abrirModalCadastro();

		// Esperar formulário visível
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("nome-produto-input"))); // ajuste se necessário

		// === PREENCHER FORMULÁRIO ===
		produtoPage.preencherFormularioProduto(
				"Categoria Teste",
				"Produto Automação",
				"Criado via Selenium",
				"59.90",
				"20"
		);

		// === CONFIRMAR CADASTRO ===
		produtoPage.confirmarCadastro();

		// === VALIDAR POPUP ===
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("popup-sucesso"))); // ajuste se necessário
		Assertions.assertTrue(produtoPage.validarPopupSucesso(), "O popup de sucesso NÃO apareceu!");

		// === FECHAR POPUP ===
		produtoPage.fecharPopup();
	}
}