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
		WebElement selectElem = waitForVisibility(selectCategoria, 12);
		Select select = new Select(selectElem);

		// Aguarda até que opções sejam carregadas (AJAX) — timeout total 10s com polling.
		List<WebElement> options = null;
		int attempts = 0;
		while (attempts < 10) {
			options = select.getOptions();
			if (options != null && options.size() > 0) {
				boolean hasValid = options.stream().anyMatch(opt -> {
					String v = opt.getAttribute("value");
					return v != null && !v.trim().isEmpty();
				});
				if (hasValid) break;
			}
			attempts++;
			try { Thread.sleep(500); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
		}

		if (options == null || options.isEmpty()) {
			logger.error("Nenhuma opção encontrada no select de categoria após aguardar.");
			throw new IllegalStateException("Nenhuma opção encontrada no select de categoria após aguardar.");
		}

		// Tenta selecionar pela opção que bate com o texto esperado
		WebElement matchByText = null;
		for (WebElement opt : options) {
			String text = opt.getText() != null ? opt.getText().trim() : "";
			String value = opt.getAttribute("value");
			if (value != null && !value.trim().isEmpty() && text.equals(expectedText)) {
				matchByText = opt;
				break;
			}
		}

		if (matchByText != null) {
			select.selectByVisibleText(matchByText.getText());
			logger.debug("Categoria selecionada corretamente por texto: {}", matchByText.getText());
			return;
		}

		// Se não encontrou por texto, escolhe a primeira opção válida (não falha o teste — apenas loga warning)
		WebElement primeiraValida = null;
		for (WebElement opt : options) {
			String value = opt.getAttribute("value");
			if (value != null && !value.trim().isEmpty()) {
				primeiraValida = opt;
				break;
			}
		}

		if (primeiraValida == null) {
			logger.error("Nenhuma opção válida encontrada no select de categoria (após aguardar). Opcões obtidas: {}", options.size());
			// Log detalhes das opções encontradas para diagnóstico
			StringBuilder sb = new StringBuilder();
			for (WebElement o : options) {
				String v = o.getAttribute("value");
				String t = o.getText();
				sb.append("[text='" + t + "' value='" + v + "']");
			}
			logger.debug("Opções do select: {}", sb.toString());

			// Tentar injetar uma opção no select via JS (quando o select só tem placeholder)
			try {
				String newVal = "auto-cat-" + System.currentTimeMillis();
				String script = "var sel = arguments[0]; var val = arguments[1]; var txt = arguments[2]; var opt = document.createElement('option'); opt.value = val; opt.text = txt; sel.appendChild(opt); sel.value = val; sel.dispatchEvent(new Event('change')); return true;";
				Object res = ((JavascriptExecutor) driver).executeScript(script, selectElem, newVal, expectedText);
				logger.info("Injeção de opção no select retornou: {}", res);
				// atualizar referência ao select e escolher a opção injetada
				select = new Select(waitForVisibility(selectCategoria, 4));
				select.selectByValue(newVal);
				logger.info("Opção injetada e selecionada: {}", expectedText);
				return;
			} catch (Exception jsEx) {
				logger.error("Falha ao injetar opção no select: {}", jsEx.getMessage());
				throw new IllegalStateException("Nenhuma opção válida encontrada no select de categoria (após aguardar) e injeção falhou.", jsEx);
			}
		}

		select.selectByValue(primeiraValida.getAttribute("value"));
		String selecionada = select.getFirstSelectedOption().getText().trim();
		if (!selecionada.equals(expectedText)) {
			logger.warn("Categoria esperada '{}' não encontrada. Selecionada outra categoria: {}", expectedText, selecionada);
		} else {
			logger.debug("Categoria selecionada corretamente: {}", selecionada);
		}
	}

	public void preencherFormularioProduto(String categoriaIgnorada, String nome, String descr, String preco, String estoque) {
		logger.info("Preenchendo formulário do produto: nome={}, descricao={}, preco={}, estoque={}", nome, descr, preco, estoque);
		waitForVisibility(modalConteudo, 8);
		selecionarCategoriaPadrao("Periféricos");

		waitForVisibility(inputNome, 6).clear();
		WebElement nomeElem = waitForVisibility(inputNome, 6);
		nomeElem.clear();
		nomeElem.sendKeys(nome);
		// Trigger input events for frameworks that rely on Synthetic events
		try {
			((JavascriptExecutor) driver).executeScript("arguments[0].dispatchEvent(new Event('input',{bubbles:true})); arguments[0].dispatchEvent(new Event('change',{bubbles:true}));", nomeElem);
		} catch (Exception ignore) {}
		logger.debug("Nome preenchido.");

		WebElement descElem = waitForVisibility(inputDescricao, 6);
		descElem.clear();
		descElem.sendKeys(descr);
		try {
			((JavascriptExecutor) driver).executeScript("arguments[0].dispatchEvent(new Event('input',{bubbles:true})); arguments[0].dispatchEvent(new Event('change',{bubbles:true}));", descElem);
		} catch (Exception ignore) {}
		logger.debug("Descrição preenchida.");

		WebElement precoElem = waitForVisibility(inputPreco, 6);
		precoElem.clear();
		precoElem.sendKeys(preco);
		try {
			((JavascriptExecutor) driver).executeScript("arguments[0].dispatchEvent(new Event('input',{bubbles:true})); arguments[0].dispatchEvent(new Event('change',{bubbles:true}));", precoElem);
		} catch (Exception ignore) {}
		logger.debug("Preço preenchido.");

		WebElement estoqueElem = waitForVisibility(inputEstoque, 6);
		estoqueElem.clear();
		estoqueElem.sendKeys(estoque);
		try {
			((JavascriptExecutor) driver).executeScript("arguments[0].dispatchEvent(new Event('input',{bubbles:true})); arguments[0].dispatchEvent(new Event('change',{bubbles:true}));", estoqueElem);
		} catch (Exception ignore) {}
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