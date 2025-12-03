package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage {

	private WebDriver driver;

	// ===== Locators (PREENCHA OS IDs reais) =====
	private By inputEmail = By.id("TODO_EMAIL");   // <-- coloque o id correto
	private By inputSenha = By.id("TODO_SENHA");   // <-- coloque o id correto
	private By botaoLogin = By.id("TODO_LOGIN");   // <-- coloque o id correto

	public LoginPage(WebDriver driver) {
		this.driver = driver;
	}

	// Abre a página de login
	public void abrirLogin() {
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
		abrirLogin();
		preencherCredenciais(email, senha);
		clicarLogin();
	}
}
