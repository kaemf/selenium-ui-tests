import { Builder, WebDriver, Browser } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';

export class DriverConfig {
  static async createDriver(): Promise<WebDriver> {
    const browser = process.env.BROWSER || 'chrome';
    const headless = process.env.HEADLESS === 'true' || process.env.CI === 'true';

    let driver: WebDriver;

    if (browser === 'firefox') {
      const options = new firefox.Options();
      if (headless) {
        options.addArguments('-headless');
      }
      options.addArguments('--width=1920');
      options.addArguments('--height=1080');
      
      driver = await new Builder()
        .forBrowser(Browser.FIREFOX)
        .setFirefoxOptions(options)
        .build();
    } else {
      const options = new chrome.Options();
      if (headless) {
        options.addArguments('--headless=new');
      }
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
      options.addArguments('--disable-gpu');
      options.addArguments('--window-size=1920,1080');
      
      driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .build();
    }

    await driver.manage().setTimeouts({
      implicit: 10000,
      pageLoad: 60000,
      script: 30000,
    });
    return driver;
  }
}
