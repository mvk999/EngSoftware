package tests;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;

import pages.LoginPage;
import pages.ProdutoPage;
import utils.DriverFactory;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class TesteProduto {

    private WebDriver driver;
    private LoginPage loginPage;
    private ProdutoPage produtoPage;

    @BeforeEach
    public void setUp() {
        // Use DriverFactory (WebDriverManager) para compatibilidade cross-platform
        driver = DriverFactory.getDriver();
        loginPage = new LoginPage(driver);
        produtoPage = new ProdutoPage(driver);
    }

    @Test
    public void testeCadastroProduto() throws InterruptedException {

        // === LOGIN ===
        loginPage.abrirPaginaLogin();
        loginPage.fazerLogin("admin@vought.com", "admin123");

        // === NAVEGAR PARA A TELA DE PRODUTOS ===
        produtoPage.abrirPaginaProduto("http://localhost:5173/produtos");

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
        assertTrue(produtoPage.validarPopupSucesso(), "Popup de sucesso NÃO apareceu!");

        // === FECHAR POPUP ===
        produtoPage.fecharPopup();
    }

    @AfterEach
    public void tearDown() {
        DriverFactory.quitDriver();
    }
}
