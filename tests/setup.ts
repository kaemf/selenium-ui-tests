// Налаштування для Jest тестів
// Збільшуємо timeout для UI тестів
jest.setTimeout(30000);

// Логування інформації про тестове середовище
beforeAll(() => {
  console.log('='.repeat(50));
  console.log('Запуск Selenium UI тестів');
  console.log(`Browser: ${process.env.BROWSER || 'chrome'}`);
  console.log(`Headless: ${process.env.HEADLESS === 'true' || process.env.CI === 'true'}`);
  console.log('='.repeat(50));
});

afterAll(() => {
  console.log('='.repeat(50));
  console.log('Завершення UI тестів');
  console.log('='.repeat(50));
});
