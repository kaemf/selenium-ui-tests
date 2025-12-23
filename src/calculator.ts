/**
 * Простий калькулятор для демонстрації unit-тестів
 */

export class Calculator {
  /**
   * Додавання двох чисел
   */
  add(a: number, b: number): number {
    return a + b;
  }

  /**
   * Віднімання двох чисел
   */
  subtract(a: number, b: number): number {
    return a - b;
  }

  /**
   * Множення двох чисел
   */
  multiply(a: number, b: number): number {
    return a * b;
  }

  /**
   * Ділення двох чисел
   * @throws Error якщо ділимо на 0
   */
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    return a / b;
  }

  /**
   * Обчислення відсотка від числа
   */
  percentage(value: number, percent: number): number {
    return (value * percent) / 100;
  }

  /**
   * Піднесення до степеня
   */
  power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }
}

/**
 * Валідація чи є число простим
 */
export function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;

  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }

  return true;
}

/**
 * Факторіал числа
 */
export function factorial(n: number): number {
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers');
  }
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

