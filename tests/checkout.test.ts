import { By, until, WebDriver, WebElement } from 'selenium-webdriver';
import { DriverConfig } from '../config/driver';

describe('SauceDemo - Тести checkout процесу', () => {
  let driver: WebDriver;
  const baseUrl = 'https://www.saucedemo.com/';

  // Надійний клік
  const safeClick = async (element: WebElement) => {
    await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', element);
    await driver.sleep(300);
    await driver.executeScript('arguments[0].click();', element);
  };

  // Логін один раз на початку
  const login = async () => {
    await driver.get(baseUrl);
    await driver.sleep(1000);
    
    const username = await driver.wait(until.elementLocated(By.id('user-name')), 15000);
    await username.click();
    await driver.executeScript("arguments[0].value = '';", username);
    await driver.sleep(200);
    await username.sendKeys('standard_user');
    await driver.sleep(400);
    
    const password = await driver.findElement(By.id('password'));
    await password.click();
    await driver.executeScript("arguments[0].value = '';", password);
    await driver.sleep(200);
    await password.sendKeys('secret_sauce');
    await driver.sleep(400);
    
    const loginBtn = await driver.findElement(By.id('login-button'));
    await safeClick(loginBtn);
    
    await driver.wait(until.urlContains('inventory.html'), 20000);
    await driver.sleep(1000);
  };

  beforeAll(async () => {
    driver = await DriverConfig.createDriver();
    await login(); // Логін один раз
  }, 60000);

  afterAll(async () => {
    if (driver) {
      try {
        await driver.quit();
      } catch (error) {
        console.error('Driver quit error:', error);
      }
    }
  }, 30000);

  beforeEach(async () => {
    try {
      // Повертаємось на inventory і очищаємо кошик
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.includes('inventory.html')) {
        await driver.get(baseUrl + 'inventory.html');
        await driver.sleep(1000);
      }
      
      // Очищаємо кошик якщо там щось є
      try {
        const cartLink = await driver.findElement(By.className('shopping_cart_link'));
        await safeClick(cartLink);
        await driver.sleep(1000);
        
        const removeButtons = await driver.findElements(By.css('[id^="remove-"]'));
        for (const btn of removeButtons) {
          await safeClick(btn);
          await driver.sleep(300);
        }
        
        await driver.get(baseUrl + 'inventory.html');
        await driver.sleep(1000);
      } catch {
        // Кошик вже порожній - це нормально
      }
    } catch (error) {
      console.error('beforeEach failed:', error);
      throw error;
    }
  }, 30000);

  test.skip('Повний процес checkout - успішне замовлення', async () => {
    // Додаємо товар
    const addBtn = await driver.wait(
      until.elementLocated(By.css('[data-test="add-to-cart-sauce-labs-backpack"]')),
      15000
    );
    await safeClick(addBtn);
    await driver.sleep(2000);
    
    // Клік на кошик
    const cartLink = await driver.findElement(By.className('shopping_cart_link'));
    await safeClick(cartLink);
    
    await driver.wait(until.urlContains('cart.html'), 20000);
    await driver.sleep(2000);
    
    // Перевіряємо що в кошику є товар
    const cartItems = await driver.findElements(By.className('cart_item'));
    expect(cartItems.length).toBeGreaterThan(0);

    // Checkout
    const checkoutBtn = await driver.findElement(By.id('checkout'));
    await safeClick(checkoutBtn);
    
    await driver.wait(until.urlContains('checkout-step-one.html'), 20000);
    await driver.sleep(1500);

    // Форма - заповнюємо через sendKeys з тригером подій
    const firstName = await driver.findElement(By.id('first-name'));
    await firstName.click();
    await driver.sleep(200);
    for (const char of 'Yaroslav') {
      await firstName.sendKeys(char);
      await driver.sleep(50);
    }
    
    const lastName = await driver.findElement(By.id('last-name'));
    await lastName.click();
    await driver.sleep(200);
    for (const char of 'Test') {
      await lastName.sendKeys(char);
      await driver.sleep(50);
    }
    
    const postalCode = await driver.findElement(By.id('postal-code'));
    await postalCode.click();
    await driver.sleep(200);
    for (const char of '10001') {
      await postalCode.sendKeys(char);
      await driver.sleep(50);
    }
    await driver.sleep(500);

    // Continue
    const continueBtn = await driver.findElement(By.id('continue'));
    await safeClick(continueBtn);
    await driver.sleep(2000);
    
    // Перевіряємо що перейшли на step-two
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('checkout-step-two');
    
    // Finish
    const finishBtn = await driver.findElement(By.id('finish'));
    await safeClick(finishBtn);

    await driver.wait(until.urlContains('checkout-complete.html'), 20000);
    
    const completeHeader = await driver.findElement(By.className('complete-header'));
    const headerText = await completeHeader.getText();
    expect(headerText.toLowerCase()).toMatch(/thank you/);
  }, 90000);

  test('Валідація форми checkout - порожнє ім\'я', async () => {
    // Додаємо товар
    const addBtn = await driver.wait(
      until.elementLocated(By.css('[data-test="add-to-cart-sauce-labs-backpack"]')),
      15000
    );
    await safeClick(addBtn);
    await driver.sleep(2000);
    
    const cartLink = await driver.findElement(By.className('shopping_cart_link'));
    await safeClick(cartLink);
    
    await driver.wait(until.urlContains('cart.html'), 20000);
    await driver.sleep(2000);

    const checkoutBtn = await driver.findElement(By.id('checkout'));
    await safeClick(checkoutBtn);
    
    await driver.wait(until.urlContains('checkout-step-one.html'), 20000);
    await driver.sleep(1000);

    // Пропускаємо first-name
    await driver.findElement(By.id('last-name')).sendKeys('Test');
    await driver.findElement(By.id('postal-code')).sendKeys('10001');
    await driver.sleep(500);

    const continueBtn = await driver.findElement(By.id('continue'));
    await safeClick(continueBtn);
    
    await driver.sleep(2000);

    // Шукаємо error різними способами
    let errorMessage;
    try {
      errorMessage = await driver.findElement(By.css('[data-test="error"]'));
    } catch {
      try {
        errorMessage = await driver.findElement(By.className('error-message-container'));
      } catch {
        errorMessage = await driver.findElement(By.xpath("//*[contains(@class, 'error')]"));
      }
    }

    expect(await errorMessage.isDisplayed()).toBe(true);
    const errorText = await errorMessage.getText();
    // SauceDemo показує: "Error: First Name is required"
    expect(errorText.toLowerCase()).toMatch(/first name is required|required/);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('checkout-step-one.html');
  }, 60000);

  test('Видалення товару з кошика', async () => {
    // Додаємо товар
    const addBtn = await driver.wait(
      until.elementLocated(By.css('[data-test="add-to-cart-sauce-labs-backpack"]')),
      15000
    );
    await safeClick(addBtn);
    await driver.sleep(2000);
    
    const cartLink = await driver.findElement(By.className('shopping_cart_link'));
    await safeClick(cartLink);
    
    await driver.wait(until.urlContains('cart.html'), 20000);
    await driver.sleep(2000);

    // ПЕРЕВІРКА: Чи є товар в кошику
    let cartItems = await driver.findElements(By.className('cart_item'));
    let itemsCount = cartItems.length;
    console.log(`Cart items count before remove: ${itemsCount}`);
    
    if (itemsCount === 0) {
      throw new Error('Cart is empty! Product was not added properly.');
    }
    
    expect(itemsCount).toBe(1);

    // Видаляємо
    const removeBtn = await driver.findElement(
      By.css('[data-test="remove-sauce-labs-backpack"]')
    );
    await safeClick(removeBtn);
    
    await driver.sleep(2000);

    // Перевіряємо що кошик порожній
    cartItems = await driver.findElements(By.className('cart_item'));
    itemsCount = cartItems.length;
    console.log(`Cart items count after remove: ${itemsCount}`);
    expect(itemsCount).toBe(0);

    const badges = await driver.findElements(By.className('shopping_cart_badge'));
    const badgesCount = badges.length;
    expect(badgesCount).toBe(0);
  }, 60000);

  test('Continue Shopping з кошика', async () => {
    // Додаємо товар
    const addBtn = await driver.wait(
      until.elementLocated(By.css('[data-test="add-to-cart-sauce-labs-backpack"]')),
      15000
    );
    await safeClick(addBtn);
    await driver.sleep(2000);
    
    const cartLink = await driver.findElement(By.className('shopping_cart_link'));
    await safeClick(cartLink);
    
    await driver.wait(until.urlContains('cart.html'), 20000);
    await driver.sleep(2000);

    const continueBtn = await driver.findElement(By.id('continue-shopping'));
    await safeClick(continueBtn);

    await driver.wait(until.urlContains('inventory.html'), 20000);
    await driver.sleep(1000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('inventory.html');

    const badge = await driver.findElement(By.className('shopping_cart_badge'));
    expect(await badge.getText()).toBe('1');
  }, 60000);

  test.skip('Перевірка розрахунку підсумкової вартості', async () => {
    // Додаємо перший товар
    const firstProduct = await driver.wait(
      until.elementLocated(By.css('[data-test="add-to-cart-sauce-labs-backpack"]')),
      15000
    );
    await safeClick(firstProduct);
    await driver.sleep(1500);
    
    // Додаємо другий товар
    const secondProduct = await driver.findElement(
      By.css('[data-test="add-to-cart-sauce-labs-bike-light"]')
    );
    await safeClick(secondProduct);
    await driver.sleep(2000);

    // Перевіряємо badge = 2
    const badge = await driver.findElement(By.className('shopping_cart_badge'));
    const badgeText = await badge.getText();
    console.log(`Badge after adding 2nd product: ${badgeText}`);
    expect(badgeText).toBe('2');

    // Кошик
    const cartLink = await driver.findElement(By.className('shopping_cart_link'));
    await safeClick(cartLink);
    
    await driver.wait(until.urlContains('cart.html'), 20000);
    await driver.sleep(2000);

    // Checkout
    const checkoutBtn = await driver.findElement(By.id('checkout'));
    await safeClick(checkoutBtn);
    
    await driver.wait(until.urlContains('checkout-step-one.html'), 20000);
    await driver.sleep(1000);

    // Форма
    await driver.findElement(By.id('first-name')).sendKeys('Yaroslav');
    await driver.findElement(By.id('last-name')).sendKeys('Test');
    await driver.findElement(By.id('postal-code')).sendKeys('10001');
    await driver.sleep(500);

    // Continue
    const continueBtn = await driver.findElement(By.id('continue'));
    await safeClick(continueBtn);
    
    await driver.wait(until.urlContains('checkout-step-two.html'), 20000);
    await driver.sleep(2000);

    // Ціни
    const priceElements = await driver.findElements(By.className('inventory_item_price'));
    const prices = await Promise.all(
      priceElements.map(async (el) => {
        const text = await el.getText();
        return parseFloat(text.replace('$', ''));
      })
    );
    const itemTotal = prices.reduce((sum, price) => sum + price, 0);

    // Subtotal
    const subtotalEl = await driver.findElement(By.className('summary_subtotal_label'));
    const subtotalText = await subtotalEl.getText();
    const subtotal = parseFloat(subtotalText.replace('Item total: $', ''));
    expect(subtotal).toBe(itemTotal);

    // Tax
    const taxEl = await driver.findElement(By.className('summary_tax_label'));
    const taxText = await taxEl.getText();
    const tax = parseFloat(taxText.replace('Tax: $', ''));

    // Total
    const totalEl = await driver.findElement(By.className('summary_total_label'));
    const totalText = await totalEl.getText();
    const total = parseFloat(totalText.replace('Total: $', ''));

    expect(total).toBeCloseTo(subtotal + tax, 2);
  }, 90000);
});
