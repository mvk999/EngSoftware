package utils;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import io.github.bonigarcia.wdm.WebDriverManager;

public class DriverFactory {

    private static WebDriver driver;

    public static WebDriver getDriver() {
        if (driver == null) {
            // Prefer Selenium Manager (bundled in Selenium) to obtain a matching driver.
            // Clear any webdriver.chrome.driver property so Selenium Manager runs.
            System.clearProperty("webdriver.chrome.driver");
            ChromeOptions options = new ChromeOptions();
            try {
                driver = new ChromeDriver(options);
            } catch (WebDriverException e) {
                // Fallback: use WebDriverManager to force a fresh driver download and retry.
                System.err.println("Selenium Manager failed to create driver: " + e.getMessage());
                try {
                    WebDriverManager.chromedriver().forceDownload().setup();
                    driver = new ChromeDriver(options);
                } catch (Exception ex) {
                    System.err.println("WebDriverManager fallback also failed: " + ex.getMessage());
                    throw ex;
                }
            }
            driver.manage().window().maximize();
        }
        return driver;
    }

    public static void quitDriver() {
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }
}
