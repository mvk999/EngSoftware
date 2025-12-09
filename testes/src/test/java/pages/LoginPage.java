package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage {

	private WebDriver driver;

	// ===== Locators =====
	private By inputEmail = By.id("email-input");
	private By inputSenha = By.id("password-input");
	private By botaoLogin = By.id("btn-login");

	public LoginPage(WebDriver driver) {
		this.driver = driver;
	}

	// Abre a página de login (coloque a URL correta)
	public void abrirPaginaLogin() {
		driver.get("http://localhost:5173/login");
	}

	// Preenche email e senha
	public void preencherCredenciais(String email, String senha) {
		driver.findElement(inputEmail).sendKeys(email);
		driver.findElement(inputSenha).sendKeys(senha);
	}

	// Clica no botão "Entrar"
	public void clicarLogin() {
		driver.findElement(botaoLogin).click();
	}

	// Fluxo completo
	public void fazerLogin(String email, String senha) {
		abrirPaginaLogin();
		preencherCredenciais(email, senha);
		clicarLogin();
	}
}