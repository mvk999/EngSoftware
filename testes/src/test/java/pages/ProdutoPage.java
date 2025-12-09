package pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProdutoPage {

	private static final Logger logger = LoggerFactory.getLogger(ProdutoPage.class);
	private WebDriver driver;

	private By botaoAbrirModal = By.id("btn-cadastrar-produto");
	private By modalConteudo = By.cssSelector(".prod-modal-content[data-testid='prod-modal-content']");
	private By selectCategoria = By.id("prod-select-categoria");
	private By inputNome = By.id("prod-input-nome");
	private By inputDescricao = By.id("prod-input-descricao");
	private By inputPreco = By.id("prod-input-preco");
	private By inputEstoque = By.id("prod-input-estoque");
	private By botaoCadastrar = By.cssSelector("[data-testid='prod-btn-confirm'], .prod-btn-confirm");
	private By popupSucesso = By.xpath("//div[contains(text(),'Produto cadastrado com sucesso.')]");
	private By botaoOkPopup = By.xpath("//button[contains(text(),'OK')]");

	private static final String MENSAGEM_SUCESSO = "Produto cadastrado com sucesso.";

	public ProdutoPage(WebDriver driver) {
		this.driver = driver;
	}

	private WebDriverWait wait(int seconds) {
		return new WebDriverWait(driver, Duration.ofSeconds(seconds));
	}

	private WebElement waitForVisibility(By locator, int seconds) {
		logger.debug("Aguardando visibilidade do elemento: {}", locator);
		return wait(seconds).until(ExpectedConditions.visibilityOfElementLocated(locator));
	}

	private WebElement waitForClickable(By locator, int seconds) {
		logger.debug("Aguardando elemento clicável: {}", locator);
		return wait(seconds).until(ExpectedConditions.elementToBeClickable(locator));
	}

	public void abrirPaginaProduto(String url) {
		logger.info("Abrindo página de produtos: {}", url);
		driver.get(url);
	}

	public void abrirModalCadastro() {
		logger.info("Tentando abrir o modal de cadastro de produto...");
		WebElement btn = waitForClickable(botaoAbrirModal, 8);
		clickWithFallback(btn);

		try {
			waitForVisibility(modalConteudo, 8);
			logger.info("Modal de cadastro aberto com sucesso.");
		} catch (TimeoutException e) {
			logger.error("Modal de cadastro não apareceu após clicar no botão.", e);
			throw new IllegalStateException("Modal de cadastro não apareceu após clicar no botão.", e);
		}
	}

	private void clickWithFallback(WebElement element) {
		try {
			element.click();
			logger.debug("Clique direto realizado com sucesso.");
			return;
		} catch (ElementClickInterceptedException | StaleElementReferenceException ex) {
			logger.warn("Falha no clique direto. Tentando fallback via JS...");
			try {
				((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
				wait(2).until(ExpectedConditions.elementToBeClickable(element));
			} catch (Exception ignore) { }

			try {
				((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
				logger.debug("Clique via JS realizado com sucesso.");
				return;
			} catch (Exception jsEx) {
				try {
					String id = element.getAttribute("id");
					if (id != null && !id.isEmpty()) {
						driver.findElement(By.id(id)).click();
						logger.debug("Clique fallback pelo ID realizado com sucesso.");
						return;
					}
				} catch (Exception finalEx) {
					logger.error("Falha ao clicar no elemento com fallback: {}", element, finalEx);
					throw new RuntimeException("Falha ao clicar no elemento: " + element, finalEx);
				}
			}
		}
	}

	private void selecionarCategoriaPadrao(String expectedText) {
		logger.info("Selecionando categoria padrão: {}", expectedText);
		WebElement selectElem = waitForVisibility(selectCategoria, 8);
		Select select = new Select(selectElem);

		List<WebElement> options = select.getOptions();
		WebElement primeiraValida = null;
		for (WebElement opt : options) {
			String value = opt.getAttribute("value");
			if (value != null && !value.trim().isEmpty()) {
				primeiraValida = opt;
				break;
			}
		}

		if (primeiraValida == null) {
			logger.error("Nenhuma opção válida encontrada no select de categoria.");
			throw new IllegalStateException("Nenhuma opção válida encontrada no select de categoria.");
		}

		select.selectByValue(primeiraValida.getAttribute("value"));
		String selecionada = select.getFirstSelectedOption().getText().trim();

		if (!selecionada.equals(expectedText)) {
			logger.error("Categoria selecionada esperada: {}. Encontrada: {}", expectedText, selecionada);
			throw new AssertionError("Categoria selecionada esperada: \"" + expectedText + "\". Encontrada: \"" + selecionada + "\".");
		} else {
			logger.debug("Categoria selecionada corretamente: {}", selecionada);
		}
	}

	public void preencherFormularioProduto(String categoriaIgnorada, String nome, String descr, String preco, String estoque) {
		logger.info("Preenchendo formulário do produto: nome={}, descricao={}, preco={}, estoque={}", nome, descr, preco, estoque);
		waitForVisibility(modalConteudo, 8);
		selecionarCategoriaPadrao("Periféricos");

		waitForVisibility(inputNome, 6).clear();
		driver.findElement(inputNome).sendKeys(nome);
		logger.debug("Nome preenchido.");

		waitForVisibility(inputDescricao, 6).clear();
		driver.findElement(inputDescricao).sendKeys(descr);
		logger.debug("Descrição preenchida.");

		waitForVisibility(inputPreco, 6).clear();
		driver.findElement(inputPreco).sendKeys(preco);
		logger.debug("Preço preenchido.");

		waitForVisibility(inputEstoque, 6).clear();
		driver.findElement(inputEstoque).sendKeys(estoque);
		logger.debug("Estoque preenchido.");
	}

	public void confirmarCadastro() {
		logger.info("Confirmando cadastro do produto...");
		waitForClickable(botaoCadastrar, 8).click();
	}

	public boolean validarPopupSucesso() {
		logger.info("Validando popup de sucesso...");
		try {
			wait(6).until(ExpectedConditions.alertIsPresent());
			Alert alert = driver.switchTo().alert();
			String text = alert.getText() != null ? alert.getText().trim() : "";
			alert.accept();
			logger.info("Popup de sucesso detectado e fechado: {}", text);
			return MENSAGEM_SUCESSO.equals(text);
		} catch (TimeoutException ignored) { }

		try {
			String text = waitForVisibility(popupSucesso, 6).getText().trim();
			boolean matches = MENSAGEM_SUCESSO.equals(text);
			if (matches) {
				try {
					waitForClickable(botaoOkPopup, 4).click();
					logger.info("Popup de sucesso fechado clicando no botão OK.");
				} catch (Exception ignore) { }
			}
			return matches;
		} catch (TimeoutException | NoSuchElementException e) {
			logger.error("Nenhum popup (alert ou modal) encontrado com a mensagem esperada.", e);
			throw new IllegalStateException("Nenhum popup (alert ou modal) encontrado com a mensagem esperada.", e);
		}
	}

	public void fecharPopup() {
		try {
			wait(2).until(ExpectedConditions.alertIsPresent());
			driver.switchTo().alert().accept();
			logger.info("Popup do navegador fechado com alert.accept()");
			return;
		} catch (Exception ignored) { }

		try {
			waitForClickable(botaoOkPopup, 4).click();
			logger.info("Popup da página fechado clicando no botão OK.");
		} catch (Exception ignored) { }
	}

	public void handleAlert() {
		try {
			WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(6));
			Alert alert = wait.until(ExpectedConditions.alertIsPresent());
			logger.info("Alert detectado. Fechando...");
			alert.accept();
			logger.info("Alert fechado com sucesso.");
		} catch (Exception e) {
			logger.warn("Nenhum alert foi encontrado para fechar.");
		}
	}
}
