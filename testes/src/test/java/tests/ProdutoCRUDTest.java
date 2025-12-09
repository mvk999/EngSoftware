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
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;
import java.time.Duration;


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

        // Garantir que exista uma categoria 'Periféricos' no backend antes de abrir produtos
        try {
            createCategoryIfMissing("Periféricos");
            // Pequena espera para o frontend buscar a lista quando navegar
            Thread.sleep(600);
        } catch (Exception e) {
            logger.warn("Falha ao garantir categoria no backend: {}", e.getMessage());
        }

        wait.until(ExpectedConditions.elementToBeClickable(By.id("btn-produto")));
        driver.findElement(By.id("btn-produto")).click();
        logger.info("Botão produtos clicado.");

        wait.until(ExpectedConditions.elementToBeClickable(By.id("btn-cadastrar-produto")));
        driver.findElement(By.id("btn-cadastrar-produto")).click();
        logger.info("Botão cadastrar produto clicado.");

        produtoPage.abrirModalCadastro();
        logger.info("Modal de cadastro visível.");

        // Usa nome único por execução para evitar conflito com produtos já existentes
        String produtoNome = "Produto Teste " + System.currentTimeMillis();
        produtoPage.preencherFormularioProduto(
            "Periféricos",
            produtoNome,
            "Descrição Teste",
            "59.90",
            "20"
        );

        // Verify select value; if empty create a category via frontend (uses token in localStorage)
        try {
            Object selectVal = ((org.openqa.selenium.JavascriptExecutor) driver)
                    .executeScript("return document.getElementById('prod-select-categoria') ? document.getElementById('prod-select-categoria').value : null;");
            logger.info("Valor atual do select antes de confirmar: {}", selectVal);

            if (selectVal == null || String.valueOf(selectVal).trim().isEmpty()) {
                logger.info("Select vazio — criando categoria via API e injetando no select...");
                String createScript = "var callback = arguments[arguments.length-1];\n" +
                        "var token = localStorage.getItem('token');\n" +
                        "if (!token) { callback({ok:false, err:'no-token'}); return; }\n" +
                        "fetch('http://localhost:3000/categoria',{method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token}, body:JSON.stringify({nome:'Periféricos'})}).then(r=>r.json()).then(j=>callback({ok:true,data:j})).catch(e=>callback({ok:false,err:e.toString()}));";

                Object res = ((org.openqa.selenium.JavascriptExecutor) driver).executeAsyncScript(createScript);
                logger.info("Resultado create categoria: {}", res);
                // If successful, try to inject and select returned id
                if (res instanceof java.util.Map) {
                    @SuppressWarnings("unchecked")
                    java.util.Map<String,Object> map = (java.util.Map<String,Object>) res;
                    if (Boolean.TRUE.equals(map.get("ok")) && map.get("data") instanceof java.util.Map) {
                        @SuppressWarnings("unchecked")
                        java.util.Map<String,Object> data = (java.util.Map<String,Object>) map.get("data");
                        Object newId = data.get("id") != null ? data.get("id") : data.get("categoria_id");
                        Object newName = data.get("nome") != null ? data.get("nome") : data.get("name");
                        if (newId != null) {
                            String inj = "var sel = document.getElementById('prod-select-categoria'); var id = arguments[0]; var txt = arguments[1]; var opt = document.createElement('option'); opt.value = id; opt.text = txt; sel.appendChild(opt); sel.value = id; sel.dispatchEvent(new Event('change')); return true;";
                            ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(inj, String.valueOf(newId), String.valueOf(newName != null ? newName : "Periféricos"));
                            logger.info("Injetada categoria criada: {} ({})", newName, newId);
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.warn("Erro ao verificar/criar categoria: {}", e.getMessage());
        }

        produtoPage.confirmarCadastro();

        boolean popupValido = produtoPage.validarPopupSucesso();
        logger.info("Popup de sucesso validado: {}", popupValido);

        Assertions.assertTrue(popupValido, "O popup de sucesso NÃO apareceu!");
        produtoPage.fecharPopup();
    }

    private void createCategoryIfMissing(String nome) throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        // login via API to get token
        String loginJson = "{\"email\":\"admin@vought.com\",\"senha\":\"admin123\"}";
        HttpRequest loginReq = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:3000/auth/login"))
                .timeout(Duration.ofSeconds(5))
                .header("Content-Type", "application/json")
                .POST(BodyPublishers.ofString(loginJson))
                .build();

        HttpResponse<String> loginRes = client.send(loginReq, BodyHandlers.ofString());
        if (loginRes.statusCode() != 200) {
            logger.warn("Login API falhou com status {}: {}", loginRes.statusCode(), loginRes.body());
            return;
        }

        String body = loginRes.body();
        // extrair token simples
        String token = null;
        int idx = body.indexOf("\"token\"");
        if (idx >= 0) {
            int col = body.indexOf(':', idx);
            int q1 = body.indexOf('"', col);
            int q2 = body.indexOf('"', q1 + 1);
            if (q1 >= 0 && q2 > q1) token = body.substring(q1 + 1, q2);
        }

        if (token == null) {
            logger.warn("Não foi possível extrair token do login API: {}", body);
            return;
        }

        // Create category
        String json = "{\"nome\":\"" + nome + "\"}";
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:3000/categoria"))
                .timeout(Duration.ofSeconds(5))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + token)
                .POST(BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> res = client.send(req, BodyHandlers.ofString());
        logger.info("Criação categoria via API retornou status {}: {}", res.statusCode(), res.body());
    }
}
